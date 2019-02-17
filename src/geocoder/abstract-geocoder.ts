import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UnsupportedAccuracyException, ValidationException } from '../exception';
import { GeocodeQueryInterface, GeocoderInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface, NullLogger } from '../logger';
import { AbstractProvider, AccuracyEnum, Address, GeocodeQuery, Query, ReverseQuery } from '../model';
import { WorldCountry, WorldCountryState, WorldCountryStateUtil, WorldCountryUtil } from '../util';

export abstract class AbstractGeocoder implements GeocoderInterface {
    private readonly logger: LoggerInterface;

    protected constructor(logger?: LoggerInterface) {
        this.logger = logger || new NullLogger();
    }

    abstract async geocode(query: GeocodeQueryInterface): Promise<Address[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Address[]>;

    /**
     * @throws {GeocoderException}
     */
    protected async geocodeByProvider(provider: AbstractProvider, _query: GeocodeQueryInterface): Promise<Address[]> {
        const query: GeocodeQuery = plainToClass<GeocodeQuery, GeocodeQueryInterface>(GeocodeQuery, _query);

        try {
            await validateOrReject(query, {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: { target: false, value: false },
            });
        } catch (err) {
            throw new ValidationException(err);
        }

        let addresses: Address[] = await provider.geocode(query);

        addresses = await this.addMissingAddressProperties(addresses, query);
        addresses = this.filterByAccuracy(addresses, query.accuracy);

        if (addresses.length > query.limit) {
            return addresses.slice(0, query.limit);
        }

        return addresses;
    }

    protected async reverseByProvider(provider: AbstractProvider, _query: ReverseQueryInterface): Promise<Address[]> {
        const query: ReverseQuery = plainToClass<ReverseQuery, ReverseQueryInterface>(ReverseQuery, _query);

        try {
            await validateOrReject(query, {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: { target: false, value: false },
            });
        } catch (err) {
            throw new ValidationException(err);
        }

        let addresses: Address[] = await provider.reverse(query);

        addresses = await this.addMissingAddressProperties(addresses, query);
        addresses = this.filterByAccuracy(addresses, query.accuracy);

        if (addresses.length > query.limit) {
            return addresses.slice(0, query.limit);
        }

        return addresses;
    }

    private async addMissingAddressProperties(addresses: Address[], query: Query): Promise<Address[]> {
        if (!query.fillMissingQueryProperties) {
            return addresses;
        }

        for (const address of addresses) {
            if (!address.countryCode || !address.country) {
                try {
                    const country: WorldCountry | undefined = await WorldCountryUtil.find({
                        cca2: address.countryCode,
                        name: address.country,
                    });

                    if (country) {
                        address.countryCode = country.cca2;
                        address.country = country.name.common;
                    }
                } catch (err) {
                    this.logger.error(err, { address });
                }
            }

            if (address.countryCode) {
                try {
                    const state: WorldCountryState | undefined = await WorldCountryStateUtil.find({
                        countryCode: address.countryCode,
                        stateCode: address.stateCode,
                        name: address.state,
                    });

                    if (state) {
                        address.state = state.name;
                        address.stateCode = state.stateCode;
                    }
                } catch (err) {
                    this.logger.error(err, { address });
                }
            }
        }

        return addresses;
    }

    private filterByAccuracy(addresses: Address[], accuracy?: AccuracyEnum): Address[] {
        if (!accuracy) {
            return addresses;
        }

        return addresses.filter((address: Address) => {
            switch (accuracy) {
                case AccuracyEnum.HOUSE_NUMBER:
                    return !!address.houseNumber;
                case AccuracyEnum.STREET_NAME:
                    return !!address.streetName;
                case AccuracyEnum.CITY:
                    return !!address.city;
                case AccuracyEnum.STATE:
                    return !!address.state || !!address.stateCode;
                case AccuracyEnum.COUNTRY:
                    return !!address.country || !!address.countryCode;
                default:
                    throw new UnsupportedAccuracyException(`Unsupported "${accuracy}" accuracy.`);
            }
        });
    }
}

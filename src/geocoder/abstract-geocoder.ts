import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UnsupportedAccuracyException, ValidationException } from '../exception';
import { GeocodeQueryInterface, GeocoderInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface, NullLogger } from '../logger';
import { AbstractHttpProvider, AbstractProvider, AccuracyEnum, GeocodeQuery, Location, ReverseQuery } from '../model';
import { WorldCountry, WorldCountryState, WorldCountryStateUtil, WorldCountryUtil } from '../util';

export abstract class AbstractGeocoder implements GeocoderInterface {
    private readonly logger: LoggerInterface;

    protected constructor(logger?: LoggerInterface) {
        this.logger = logger || new NullLogger();
    }

    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;

    /**
     * @throws {GeocoderException}
     */
    protected async geocodeByProvider(provider: AbstractProvider, _query: GeocodeQueryInterface): Promise<Location[]> {
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

        if (query.accuracy && provider instanceof AbstractHttpProvider && !provider.isProvidesAccuracy(query.accuracy)) {
            const message: string = `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${
                provider.maxAccuracy
            }")`;
            this.logger.error(message);
            throw new UnsupportedAccuracyException(message);
        }

        let locations: Location[] = await provider.geocode(query);

        locations = await this.addMissingLocationProperties(locations);
        locations = this.filterByAccuracy(locations, query.accuracy);

        if (locations.length > query.limit) {
            return locations.slice(0, query.limit);
        }

        return locations;
    }

    protected async reverseByProvider(provider: AbstractProvider, _query: ReverseQueryInterface): Promise<Location[]> {
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

        if (query.accuracy && provider instanceof AbstractHttpProvider && !provider.isProvidesAccuracy(query.accuracy)) {
            const message: string = `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${
                provider.maxAccuracy
            }")`;
            this.logger.error(message);
            throw new UnsupportedAccuracyException(message);
        }

        let locations: Location[] = await provider.reverse(query);

        locations = await this.addMissingLocationProperties(locations);
        locations = this.filterByAccuracy(locations, query.accuracy);

        if (locations.length > query.limit) {
            return locations.slice(0, query.limit);
        }

        return locations;
    }

    private async addMissingLocationProperties(locations: Location[]): Promise<Location[]> {
        for (const location of locations) {
            if (!location.countryCode || !location.country) {
                try {
                    const country: WorldCountry | undefined = await WorldCountryUtil.find({
                        cca2: location.countryCode,
                        name: location.country,
                    });

                    if (country) {
                        location.countryCode = country.cca2;
                        location.country = country.name.common;
                    }
                } catch (err) {
                    this.logger.error(err, { location });
                }
            }

            if (location.countryCode) {
                try {
                    const state: WorldCountryState | undefined = await WorldCountryStateUtil.find({
                        countryCode: location.countryCode,
                        stateCode: location.stateCode,
                        name: location.state,
                    });

                    if (state) {
                        location.state = state.name;
                        location.stateCode = state.stateCode;
                    }
                } catch (err) {
                    this.logger.error(err, { location });
                }
            }
        }

        return locations;
    }

    private filterByAccuracy(locations: Location[], accuracy?: AccuracyEnum): Location[] {
        if (!accuracy) {
            return locations;
        }

        return locations.filter((location: Location) => {
            switch (accuracy) {
                case AccuracyEnum.HOUSE_NUMBER:
                    return !!location.houseNumber;
                case AccuracyEnum.STREET_NAME:
                    return !!location.streetName;
                case AccuracyEnum.CITY:
                    return !!location.city;
                case AccuracyEnum.STATE:
                    return !!location.state || !!location.stateCode;
                case AccuracyEnum.COUNTRY:
                    return !!location.country || !!location.countryCode;
                default:
                    throw new UnsupportedAccuracyException(`Unsupported "${accuracy}" accuracy.`);
            }
        });
    }
}

import { AxiosResponse } from 'axios';
import { UnsupportedAccuracyException } from '../exception';
import { QueryInterface } from '../interface';
import { LoggableInterface } from '../logger';
import { AccuracyEnum, Location, LocationBuilder } from '../model';
import { WorldCountry, WorldCountryUtil } from '../util/world-country';
import { WorldCountryState, WorldCountryStateUtil } from '../util/world-country-state';
import { AbstractCommand } from './abstract.command';

export abstract class AbstractLocationCommand<
    GeocoderQueryType extends QueryInterface = any,
    ProviderRequestType = any,
    ProviderResponseType = any
> extends AbstractCommand<GeocoderQueryType, Location, LocationBuilder, ProviderRequestType, ProviderResponseType> {
    'constructor': Pick<typeof AbstractLocationCommand, keyof typeof AbstractLocationCommand> & { name: string } & LoggableInterface;

    protected async parseResponse(_response: AxiosResponse<ProviderResponseType>, _query: GeocoderQueryType): Promise<LocationBuilder[]> {
        throw new Error('AbstractLocationCommand.parseResponse: not implemented');
    }

    async execute(query: GeocoderQueryType): Promise<Location[]> {
        let locations: Location[] = await super.execute(query);

        locations = await this.addMissingLocationProperties(locations);
        locations = this.filterByAccuracy(locations, query.accuracy);

        if (query.limit && locations.length > query.limit) {
            return locations.slice(0, query.limit);
        }

        return locations;
    }

    protected async addMissingLocationProperties(locations: Location[]): Promise<Location[]> {
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
                    this.getLogger().error(err, { location });
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
                    this.getLogger().error(err, { location });
                }
            }
        }

        return locations;
    }

    protected filterByAccuracy(locations: Location[], accuracy?: AccuracyEnum): Location[] {
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

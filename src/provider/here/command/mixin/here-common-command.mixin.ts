import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { InvalidCredentialsException } from '../../../../exception';
import { AccuracyEnum, LocationBuilder, Query } from '../../../../model';
import { Constructor } from '../../../../types';
import { WorldCountry, WorldCountryUtil } from '../../../../util/world-country';
import { HereProvider } from '../../here.provider';
import { filterByAccuracy } from '../../util';

export function HereCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class HereCommonCommand extends Base {
        protected readonly appId: string;
        protected readonly appCode: string;

        protected constructor(...args: any[]) {
            super(args[0]);

            this.appId = args[1];
            this.appCode = args[2];

            if (!this.appId || !this.appCode) {
                throw new InvalidCredentialsException('Invalid or missing api key.');
            }
        }

        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

        protected async validateResponse(_response: AxiosResponse): Promise<void> {
            //
        }

        protected async parseResponse(response: AxiosResponse, query: Query): Promise<LocationBuilder<HereProvider>[]> {
            if (!response.data.Response || !Array.isArray(response.data.Response.View) || !response.data.Response.View[0]) {
                return [];
            }

            let results: any[] = response.data.Response.View[0].Result;

            results = results.filter((raw: any) => filterByAccuracy(raw, query.accuracy));
            if (!results.length) {
                return [];
            }

            return Promise.all<LocationBuilder<HereProvider>>(
                results.map(
                    async (raw: any): Promise<LocationBuilder<HereProvider>> => {
                        const hereAddress: any = raw.Location.Address || {};

                        const builder: LocationBuilder<HereProvider> = new LocationBuilder(HereProvider, raw);
                        builder.formattedAddress = hereAddress.Label;
                        builder.latitude = raw.Location.DisplayPosition.Latitude;
                        builder.longitude = raw.Location.DisplayPosition.Longitude;
                        // builder.countryCode = country ? country.cca2 : hereAddress.Country;
                        builder.state = hereAddress.State;
                        builder.stateCode = hereAddress.State;
                        builder.city = hereAddress.City;
                        builder.postalCode = hereAddress.PostalCode;
                        builder.streetName = hereAddress.Street;
                        builder.houseNumber = hereAddress.HouseNumber;
                        builder.placeId = raw.Location.LocationId;

                        for (const additionalData of hereAddress.AdditionalData) {
                            switch (additionalData.key) {
                                case 'Country2':
                                    builder.countryCode = additionalData.value;
                                    break;
                                case 'CountryName':
                                    builder.country = additionalData.value;
                                    break;
                                case 'StateName':
                                    builder.state = additionalData.value;
                                    break;
                            }
                        }

                        if (builder.country || builder.countryCode) {
                            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                                cca3: hereAddress.Country,
                            });

                            if (country) {
                                if (!builder.country) {
                                    builder.country = country.name.common;
                                }

                                if (!builder.countryCode) {
                                    builder.countryCode = country.cca2;
                                }
                            }
                        }

                        return builder;
                    },
                ),
            );
        }
    }

    return HereCommonCommand;
}

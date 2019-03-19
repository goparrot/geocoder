import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { InvalidCredentialsException } from '../../../../exception';
import { AccuracyEnum, Location, LocationBuilder } from '../../../../model';
import { Constructor } from '../../../../types';
import { WorldCountry, WorldCountryUtil } from '../../../../util/world-country';
import { HereProvider } from '../../here.provider';

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

        protected async parseResponse(response: AxiosResponse): Promise<Location[]> {
            if (!response.data.Response || !Array.isArray(response.data.Response.View) || !response.data.Response.View[0]) {
                return [];
            }

            const results: any = response.data.Response.View[0].Result;

            return Promise.all<Location>(
                results.map(
                    async (raw: any): Promise<Location> => {
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

                        return builder.build();
                    },
                ),
            );
        }
    }

    return HereCommonCommand;
}

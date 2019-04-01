import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../../../../exception';
import { LocationBuilder } from '../../../../model';
import { Constructor } from '../../../../types';
import { LocationUtil } from '../../../../util/location';
import { WorldCountry, WorldCountryUtil } from '../../../../util/world-country';
import { ArcgisProvider } from '../../arcgis.provider';
import { ArcgisCommonCommandMixin } from './arcgis-common-command.mixin';

export function ArcgisGeocodeCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class ArcgisGeocodeCommand extends ArcgisCommonCommandMixin(Base) {
        protected async validateResponse(response: AxiosResponse): Promise<void> {
            if (response.data.error) {
                const error: any = response.data.error;

                switch (error.code) {
                    case 400:
                        throw new InvalidArgumentException(error.message, response);
                    case 403:
                    case 498:
                    case 499:
                        throw new InvalidCredentialsException(error.message, response);
                    default:
                        throw new InvalidServerResponseException(error.message, response);
                }
            }
        }

        protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<ArcgisProvider>[]> {
            if (!Array.isArray(response.data.candidates) || !response.data.candidates.length) {
                return [];
            }

            return Promise.all<LocationBuilder<ArcgisProvider>>(
                response.data.candidates.map(
                    async (raw: any): Promise<LocationBuilder<ArcgisProvider>> => {
                        const builder: LocationBuilder<ArcgisProvider> = new LocationBuilder(ArcgisProvider, raw);
                        builder.formattedAddress = raw.attributes.LongLabel;
                        builder.latitude = raw.attributes.DisplayY;
                        builder.longitude = raw.attributes.DisplayX;

                        if (raw.attributes.Country) {
                            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                                cca3: raw.attributes.Country,
                            });

                            if (country) {
                                builder.country = country.name.common;
                                builder.countryCode = country.cca2;
                            }
                        }

                        builder.stateCode = raw.attributes.RegionAbbr;
                        builder.state = raw.attributes.Region;
                        builder.city = raw.attributes.City;
                        // StAddr always includes a house number
                        builder.streetName = raw.attributes.AddNum
                            ? LocationUtil.removeHouseNumberFromStreetName(raw.attributes.StAddr, raw.attributes.AddNum)
                            : raw.attributes.StAddr;
                        builder.houseNumber = raw.attributes.AddNum;
                        builder.postalCode = raw.attributes.Postal;

                        return builder;
                    },
                ),
            );
        }
    }

    return ArcgisGeocodeCommand;
}

import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { LocationBuilder } from '../../../../model';
import { Constructor } from '../../../../types';
import { GoogleMapsProvider } from '../../google-maps.provider';
import { GoogleMapsCommonCommandMixin } from './google-maps-common-command.mixin';

export function GoogleMapsLocationCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class GoogleMapsLocationCommand extends GoogleMapsCommonCommandMixin(Base) {
        protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<GoogleMapsProvider>[]> {
            if (!Array.isArray(response.data.results) || !response.data.results.length) {
                return [];
            }

            return Promise.all<LocationBuilder<GoogleMapsProvider>>(
                response.data.results.map(async (raw: any): Promise<LocationBuilder<GoogleMapsProvider>> => this.parseOneResult(raw)),
            );
        }

        protected async parseOneResult(raw: any): Promise<LocationBuilder<GoogleMapsProvider>> {
            const builder: LocationBuilder<GoogleMapsProvider> = new LocationBuilder(GoogleMapsProvider, raw);
            builder.formattedAddress = raw.formatted_address;
            builder.latitude = raw.geometry.location.lat;
            builder.longitude = raw.geometry.location.lng;
            builder.placeId = raw.place_id;

            for (const addressComponent of raw.address_components) {
                for (const type of addressComponent.types) {
                    this.updateAddressComponent(builder, type, addressComponent);
                }
            }

            return builder;
        }

        protected updateAddressComponent(builder: LocationBuilder<GoogleMapsProvider>, type: string, addressComponent: any): void {
            switch (type) {
                case 'country':
                    builder.country = addressComponent.long_name;
                    builder.countryCode = addressComponent.short_name;
                    break;
                case 'administrative_area_level_1':
                    builder.state = addressComponent.long_name;
                    builder.stateCode = addressComponent.short_name;
                    break;
                case 'locality':
                case 'sublocality':
                case 'administrative_area_level_3':
                case 'administrative_area_level_2':
                case 'postal_town':
                    if (!builder.city) {
                        builder.city = addressComponent.long_name;
                    }
                    break;
                case 'postal_code':
                    builder.postalCode = addressComponent.long_name;
                    break;
                case 'route':
                    builder.streetName = addressComponent.long_name;
                    break;
                case 'street_number':
                    builder.houseNumber = addressComponent.long_name;
                    break;
            }
        }
    }

    return GoogleMapsLocationCommand;
}

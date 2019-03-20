import { AxiosInstance, AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import { AbstractCommand } from '../../../../command';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../../exception';
import { AccuracyEnum, LocationBuilder } from '../../../../model';
import { Constructor } from '../../../../types';
import { GoogleMapsProvider } from '../../google-maps.provider';

export function GoogleMapsCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class GoogleMapsCommonCommand extends Base {
        protected readonly apiKey: any;

        protected constructor(...args: any[]) {
            const [httpClient, apiKey]: [AxiosInstance, string] = args as any;

            super(httpClient);

            this.apiKey = apiKey;

            if (!this.apiKey) {
                throw new InvalidCredentialsException('Invalid or missing api key.');
            }
        }

        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

        /**
         * @link {https://developers.google.com/maps/documentation/geocoding/intro#StatusCodes}
         */
        protected async validateResponse(response: AxiosResponse): Promise<void> {
            if (isEmpty(response.data)) {
                return;
            }

            if ('OK' === response.data.status) {
                return;
            }

            if ('REQUEST_DENIED' === response.data.status && 'The provided API key is invalid.' === response.data.error_message) {
                throw new InvalidCredentialsException('API key is invalid', response);
            } else if ('REQUEST_DENIED' === response.data.status) {
                throw new InvalidServerResponseException('API key is invalid', response);
            } else if ('OVER_QUERY_LIMIT' === response.data.status) {
                throw new QuotaExceededException('Quota exceeded', response);
            } else if ('OVER_DAILY_LIMIT' === response.data.status) {
                /**
                 * @link {https://developers.google.com/maps/faq#over-limit-key-error}
                 */
                throw new QuotaExceededException('Daily quota exceeded', response);
            } else if ('INVALID_REQUEST' === response.data.status) {
                throw new InvalidArgumentException('Invalid request', response);
            } else if ('UNKNOWN_ERROR' === response.data.status) {
                throw new InvalidServerResponseException('Unknown error', response);
            } else if ('ZERO_RESULTS' === response.data.status) {
                return;
            }

            throw new InvalidServerResponseException(`Unknown status "${response.data.status}" error`, response);
        }

        protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<GoogleMapsProvider>[]> {
            if (!Array.isArray(response.data.results) || !response.data.results.length) {
                return [];
            }

            return Promise.all<LocationBuilder<GoogleMapsProvider>>(
                response.data.results.map(
                    async (raw: any): Promise<LocationBuilder<GoogleMapsProvider>> => {
                        // TODO Do need to implement postal_code_suffix options ?
                        const builder: LocationBuilder<GoogleMapsProvider> = new LocationBuilder(GoogleMapsProvider, raw);
                        builder.formattedAddress = raw.formatted_address;
                        builder.latitude = raw.geometry.location.lat;
                        builder.longitude = raw.geometry.location.lng;

                        for (const addressComponent of raw.address_components) {
                            for (const type of addressComponent.types) {
                                this.updateAddressComponent(builder, type, addressComponent);
                            }
                        }

                        return builder;
                    },
                ),
            );
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
                case 'postal_town':
                    builder.city = addressComponent.long_name;
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

    return GoogleMapsCommonCommand;
}

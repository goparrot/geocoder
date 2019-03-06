import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../exception';
import { AbstractHttpProvider, AccuracyEnum, GeocodeQuery, Location, ReverseQuery } from '../model';
import { LocationBuilder } from '../model/location-builder';

export interface GoogleMapsProviderGeocodeParamsInterface {
    sensor: boolean;
    key: string;
    address: string;
    components: string;
    /**
     * Country code used to bias the search, specified as a Unicode region subtag / CLDR identifier. Optional.
     */
    region?: string;
    limit: number;
    language: string;
}

export interface GoogleMapsProviderReverseParamsInterface {
    sensor: boolean;
    key: string;
    latlng: string;
    /**
     * Country code used to bias the search, specified as a Unicode region subtag / CLDR identifier. Optional.
     */
    region?: string;
    limit: number;
    language: string;
}

export class GoogleMapsProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient);

        if (!this.apiKey) {
            throw new InvalidCredentialsException('Invalid or missing api key.');
        }
    }

    get maxAccuracy(): AccuracyEnum {
        return AccuracyEnum.HOUSE_NUMBER;
    }

    get geocodeUrl(): string {
        return 'https://maps.googleapis.com/maps/api/geocode/json';
    }

    get reverseUrl(): string {
        return this.geocodeUrl;
    }

    /**
     * TODO implement all statuses https://developers.google.com/maps/documentation/geocoding/intro#StatusCodes
     * @link {https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests}
     */
    async geocode(query: GeocodeQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data);
    }

    /**
     * TODO implement result_type and location_type
     * @link {https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding}
     */
    async reverse(query: ReverseQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseResponse(response.data);
    }

    private async buildGeocodeQuery(query: GeocodeQuery): Promise<GoogleMapsProviderGeocodeParamsInterface> {
        const components: Map<string, string> = new Map();

        if (query.postalCode) {
            components.set('postal_code', query.postalCode);
        }

        if (query.countryCode || query.country) {
            components.set('country', query.countryCode || query.country || '');
        }

        if (query.stateCode || query.state) {
            components.set('administrative_area', query.stateCode || query.state || '');
        }

        return {
            key: this.apiKey,
            // TODO Do need to implement region options? https://developers.google.com/maps/documentation/geocoding/intro#geocoding
            // region: '',
            address: this.encodeSpecialChars(query.address),
            components: this.encodeSpecialChars([...components].map<string>((value: [string, string]) => `${value[0]}:${value[1]}`).join('|')),
            language: query.language,
            limit: query.limit,
            sensor: false,
        };
    }

    private async buildReverseQuery(query: ReverseQuery): Promise<GoogleMapsProviderReverseParamsInterface> {
        return {
            key: this.apiKey,
            latlng: `${query.lat},${query.lon}`,
            limit: query.limit,
            language: query.language,
            sensor: false,
        };
    }

    private async parseResponse(response: any): Promise<Location[]> {
        this.validateResponse(response);

        if ('OK' !== response.status || !Array.isArray(response.results) || !response.results.length) {
            return [];
        }

        return response.results.map(
            (result: any): Location => {
                // TODO Do need to implement postal_code_suffix options ?
                const builder: LocationBuilder = new LocationBuilder(GoogleMapsProvider);
                builder.formattedAddress = result.formatted_address;
                builder.latitude = result.geometry.location.lat;
                builder.longitude = result.geometry.location.lng;

                for (const addressComponent of result.address_components) {
                    for (const type of addressComponent.types) {
                        this.updateAddressComponent(builder, type, addressComponent);
                    }
                }

                return builder.build();
            },
        );
    }

    /**
     * @throws {GeocoderException}
     */
    private validateResponse(response: any): void {
        if ('REQUEST_DENIED' === response.status && 'The provided API key is invalid.' === response.error_message) {
            throw new InvalidCredentialsException(`API key is invalid'`);
        } else if ('REQUEST_DENIED' === response.status) {
            throw new InvalidServerResponseException(`API key is invalid. Message: ${response.error_message}`);
        } else if ('OVER_QUERY_LIMIT' === response.status) {
            throw new QuotaExceededException(`Daily quota exceeded`);
        }
    }

    private updateAddressComponent(builder: LocationBuilder, type: string, addressComponent: any): void {
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

    private encodeSpecialChars(value: string): string {
        return value; // .replace(/\u001a/g, ' ');
    }
}

import { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import { GeocodeQuery } from '../../../model';
import { GoogleMapsGeocodeQueryInterface } from '../interface';
import { GoogleMapsCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests}
 */
export class GoogleMapsGeocodeCommand extends GoogleMapsCommonCommandMixin(GeocodeCommand)<GoogleMapsGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/geocode/json';
    }

    protected async buildQuery(query: GeocodeQuery): Promise<GoogleMapsGeocodeQueryInterface> {
        const components: Map<string, string> = new Map();

        if (query.postalCode) {
            components.set('postal_code', query.postalCode);
        }

        const country: string = query.countryCode || query.country || '';
        if (country) {
            components.set('country', country);
        }

        const state: string = query.stateCode || query.state || '';
        if (state) {
            components.set('administrative_area', state);
        }

        return {
            key: this.apiKey,
            // TODO Do need to implement region options? https://developers.google.com/maps/documentation/geocoding/intro#geocoding
            // region: '',
            address: query.address,
            components: [...components].map<string>((value: [string, string]) => `${value[0]}:${value[1]}`).join('|'),
            language: query.language,
            limit: query.limit,
            sensor: false,
        };
    }
}

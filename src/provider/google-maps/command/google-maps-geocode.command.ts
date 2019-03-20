import { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import { GeocodeQuery } from '../../../model';
import { GoogleMapsGeocodeQueryInterface } from '../interface';
import { GoogleMapsLocationCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests}
 */
export class GoogleMapsGeocodeCommand extends GoogleMapsLocationCommandMixin(GeocodeCommand)<GoogleMapsGeocodeQueryInterface> {
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

        const country: string | undefined = query.countryCode || query.country;
        if (country) {
            components.set('country', country);
        }

        const state: string | undefined = query.stateCode || query.state;
        if (state) {
            components.set('administrative_area', state);
        }

        const providerQuery: GoogleMapsGeocodeQueryInterface = {
            key: this.apiKey,
            address: query.address,
            components: [...components].map<string>((value: [string, string]) => `${value[0]}:${value[1]}`).join('|'),
            language: query.language,
            limit: query.limit,
            sensor: false,
        };

        if (query.countryCode) {
            providerQuery.region = `.${query.countryCode.toLowerCase()}`;
        }

        return providerQuery;
    }
}

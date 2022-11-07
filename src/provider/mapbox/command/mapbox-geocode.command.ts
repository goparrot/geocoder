import type { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import type { GeocodeQuery } from '../../../model';
import type { MapboxGeocodeMode, MapboxGeocodeQueryInterface } from '../interface';
import { MapboxGeocodeCommandMixin } from './mixin';

/**
 * @link {https://docs.mapbox.com/api/search/geocoding/#forward-geocoding}
 */
export class MapboxGeocodeCommand extends MapboxGeocodeCommandMixin(GeocodeCommand)<MapboxGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly accessToken: string, private readonly mode: MapboxGeocodeMode) {
        super(httpClient);
    }

    static getUrl(endpoint: MapboxGeocodeMode, searchText: string): string {
        return `https://api.mapbox.com/geocoding/v5/${endpoint}/${encodeURIComponent(searchText)}.json`;
    }

    protected async buildQuery(query: GeocodeQuery): Promise<MapboxGeocodeQueryInterface> {
        return {
            access_token: this.accessToken,
            mode: this.mode,
            query: query.address,
            // @ts-expect-error function from mixin
            types: this.convertAccuracyToTypes(query.accuracy).join(','),
            countries: query.countryCode ? [query.countryCode] : undefined,
            limit: Math.min(query.limit, 10),
            language: query.language,
            autocomplete: true,
        };
    }
}

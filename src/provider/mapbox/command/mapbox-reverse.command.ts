import type { AxiosInstance } from 'axios';
import { ReverseCommand } from '../../../command';
import type { ReverseQuery } from '../../../model';
import type { MapboxReverseQueryInterface } from '../interface';
import type { MapboxGeocodeMode } from '../interface/mapbox.type';
import { MapboxReverseCommandMixin } from './mixin';

/**
 * @link {https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding}
 */
export class MapboxReverseCommand extends MapboxReverseCommandMixin(ReverseCommand)<MapboxReverseQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly accessToken: string, private readonly mode: MapboxGeocodeMode) {
        super(httpClient);
    }

    static getUrl(endpoint: MapboxGeocodeMode, longitude: number, latitude: number): string {
        return `https://api.mapbox.com/geocoding/v5/${endpoint}/${longitude},${latitude}.json`;
    }

    protected async buildQuery(query: ReverseQuery): Promise<MapboxReverseQueryInterface> {
        return {
            access_token: this.accessToken,
            mode: this.mode,
            lat: query.lat,
            lon: query.lon,
            // @ts-expect-error function from mixin
            types: this.convertAccuracyToTypes(query.accuracy).join(','),
            countries: query.countryCode ? [query.countryCode] : undefined,
            // If you make a reverse geocoding request with the limit parameter, you must also use the type parameter.
            limit: query.accuracy ? Math.min(query.limit, 5) : undefined,
            language: query.language,
            routing: false,
        };
    }
}

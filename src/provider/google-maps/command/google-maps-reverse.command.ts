import { AxiosInstance } from 'axios';
import { ReverseCommand } from '../../../command';
import { ReverseQuery } from '../../../model';
import { GoogleMapsReverseQueryInterface } from '../interface';
import { GoogleMapsCommonCommandMixin } from './mixin';

/**
 * TODO implement result_type and location_type
 * @link {https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding}
 */
export class GoogleMapsReverseCommand extends GoogleMapsCommonCommandMixin(ReverseCommand)<GoogleMapsReverseQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/geocode/json';
    }

    protected async buildQuery(query: ReverseQuery): Promise<GoogleMapsReverseQueryInterface> {
        return {
            key: this.apiKey,
            latlng: `${query.lat},${query.lon}`,
            limit: query.limit,
            language: query.language,
            sensor: false,
        };
    }
}

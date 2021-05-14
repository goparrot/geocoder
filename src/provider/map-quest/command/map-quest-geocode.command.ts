import { GeocodeCommand } from '../../../command';
import { MapQuestCommonCommandMixin } from './mixin';
import type { AxiosInstance } from 'axios';
import type { GeocodeQuery } from '../../../model';
import type { MapQuestGeocodeQueryInterface } from '../interface';

/**
 * @link {https://developer.mapquest.com/documentation/geocoding-api/address/get/}
 */
export class MapQuestGeocodeCommand extends MapQuestCommonCommandMixin(GeocodeCommand)<MapQuestGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://www.mapquestapi.com/geocoding/v1/address';
    }

    protected async buildQuery(query: GeocodeQuery): Promise<MapQuestGeocodeQueryInterface> {
        const providerQuery: MapQuestGeocodeQueryInterface = {
            key: this.apiKey,
            location: query.address,
            maxResults: query.limit,
            thumbMaps: false,
            outFormat: 'json',
        };

        if (query.lat && query.lon) {
            providerQuery.location = `${query.lon},${query.lat}`;
        }

        return providerQuery;
    }
}

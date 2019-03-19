import { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import { GeocodeQuery } from '../../../model';
import { MapQuestGeocodeQueryInterface } from '../interface';
import { MapQuestCommonCommandMixin } from './mixin';

/**
 * @link {https://developer.mapquest.com/documentation/geocoding-api/address/get/}
 */
export class MapQuestGeocodeCommand extends MapQuestCommonCommandMixin(GeocodeCommand)<MapQuestGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://www.mapquestapi.com/geocoding/v1/address';
    }

    protected async buildQuery(query: GeocodeQuery): Promise<MapQuestGeocodeQueryInterface> {
        return {
            key: this.apiKey,
            location: query.address,
            maxResults: query.limit,
            thumbMaps: false,
            outFormat: 'json',
        };
    }
}

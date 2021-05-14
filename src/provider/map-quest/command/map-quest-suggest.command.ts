import { SuggestCommand } from '../../../command';
import { MapQuestSuggestionTransformer } from '../transformer';
import { MapQuestCommonCommandMixin } from './mixin';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { SuggestQuery } from '../../../model';
import type { AbstractSuggestionTransformer } from '../../../transformer';
import type { MapQuestSuggestQueryInterface } from '../interface';
import type { MapQuestProvider } from '../map-quest.provider';

/**
 * @link {https://developer.mapquest.com/documentation/searchahead-api/}
 */
export class MapQuestSuggestCommand extends MapQuestCommonCommandMixin(SuggestCommand)<MapQuestSuggestQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://www.mapquestapi.com/search/v3/prediction';
    }

    protected async buildQuery(query: SuggestQuery): Promise<MapQuestSuggestQueryInterface> {
        const providerQuery: MapQuestSuggestQueryInterface = {
            key: this.apiKey,
            q: query.address,
            limit: query.limit,
            collection: 'address',
            countryCode: query.countryCode,
            languageCode: query.language,
        };

        if (query.lat && query.lon) {
            providerQuery.location = `${query.lon},${query.lat}`;
        }

        return providerQuery;
    }

    protected async parseResponse(response: AxiosResponse): Promise<AbstractSuggestionTransformer<MapQuestProvider>[]> {
        if (!Array.isArray(response.data.results) || !response.data.results.length) {
            return [];
        }

        const locations: any[] = response.data.results;
        if (!Array.isArray(locations) || !locations.length) {
            return [];
        }

        return Promise.all<AbstractSuggestionTransformer<MapQuestProvider>>(
            locations.map(async (raw: any): Promise<AbstractSuggestionTransformer<MapQuestProvider>> => new MapQuestSuggestionTransformer(raw)),
        );
    }
}

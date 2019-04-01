import { AxiosInstance, AxiosResponse } from 'axios';
import { SuggestCommand } from '../../../command';
import { SuggestionBuilder, SuggestQuery } from '../../../model';
import { MapQuestSuggestQueryInterface } from '../interface';
import { MapQuestProvider } from '../map-quest.provider';
import { MapQuestCommonCommandMixin } from './mixin';

/**
 * @link {https://developer.mapquest.com/documentation/searchahead-api/}
 */
export class MapQuestSuggestCommand extends MapQuestCommonCommandMixin(SuggestCommand)<MapQuestSuggestQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
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

    protected async parseResponse(response: AxiosResponse): Promise<SuggestionBuilder<MapQuestProvider>[]> {
        if (!Array.isArray(response.data.results) || !response.data.results.length) {
            return [];
        }

        const locations: any[] = response.data.results;
        if (!Array.isArray(locations) || !locations.length) {
            return [];
        }

        return Promise.all<SuggestionBuilder<MapQuestProvider>>(
            locations.map(
                async (raw: any): Promise<SuggestionBuilder<MapQuestProvider>> => {
                    const builder: SuggestionBuilder<MapQuestProvider> = new SuggestionBuilder(MapQuestProvider, raw);
                    builder.formattedAddress = raw.displayString;
                    builder.placeId = raw.id;

                    return builder;
                },
            ),
        );
    }
}

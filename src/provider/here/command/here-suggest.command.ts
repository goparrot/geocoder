import type { AxiosInstance, AxiosResponse } from 'axios';
import { SuggestCommand } from '../../../command';
import type { SuggestQueryInterface } from '../../../interface';
import type { HereResponseType, HereSuggestQueryInterface } from '../interface';
import { HereSuggestionTransformer } from '../transformer';
import { filterByAccuracy } from '../util';
import { HereLocationCommandMixin } from './mixin';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-search.html}
 */
export class HereSuggestCommand extends HereLocationCommandMixin(SuggestCommand)<HereSuggestQueryInterface, HereResponseType> {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        super(httpClient, appId, appCode);
    }

    static getUrl(): string {
        return 'https://geocoder.api.here.com/6.2/search.json';
    }

    protected async parseResponse(response: AxiosResponse<HereResponseType>, query: SuggestQueryInterface): Promise<HereSuggestionTransformer[]> {
        if (!response.data.Response || !Array.isArray(response.data.Response.View) || !response.data.Response.View[0]) {
            return [];
        }

        let results: any[] = response.data.Response.View[0].Result;

        results = results.filter((raw: any) => filterByAccuracy(raw, query.accuracy));
        if (!results.length) {
            return [];
        }

        return Promise.all<HereSuggestionTransformer>(results.map(async (raw: any): Promise<HereSuggestionTransformer> => new HereSuggestionTransformer(raw)));
    }
}

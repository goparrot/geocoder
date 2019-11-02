import { AxiosResponse } from 'axios';
import { QueryInterface } from '../interface';
import { Suggestion } from '../model';
import { AbstractSuggestionTransformer } from '../transformer';
import { AbstractCommand } from './abstract.command';

export abstract class AbstractSuggestCommand<
    GeocoderQueryType extends QueryInterface = any,
    ProviderRequestType = any,
    ProviderResponseType = any
> extends AbstractCommand<GeocoderQueryType, Suggestion, AbstractSuggestionTransformer, ProviderRequestType, ProviderResponseType> {
    protected async parseResponse(_response: AxiosResponse<ProviderResponseType>, _query: GeocoderQueryType): Promise<AbstractSuggestionTransformer[]> {
        throw new Error('AbstractSuggestCommand.parseResponse: not implemented');
    }

    async execute(query: GeocoderQueryType): Promise<Suggestion[]> {
        const suggestions: Suggestion[] = await super.execute(query);

        if (query.limit && suggestions.length > query.limit) {
            return suggestions.slice(0, query.limit);
        }

        return suggestions;
    }
}

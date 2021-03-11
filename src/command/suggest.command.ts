import type { SuggestQueryInterface } from '../interface';
import { SuggestQuery } from '../model';
import { AbstractSuggestCommand } from './abstract-suggest.command';

export class SuggestCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractSuggestCommand<
    SuggestQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof SuggestQuery {
        return SuggestQuery;
    }
}

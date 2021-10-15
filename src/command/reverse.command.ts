import { ReverseQuery } from '../model';
import type { ReverseQueryInterface } from '../interface';
import { AbstractLocationCommand } from './abstract-location.command';

export class ReverseCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractLocationCommand<
    ReverseQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof ReverseQuery {
        return ReverseQuery;
    }
}

import { ReverseQuery } from '../model';
import { AbstractLocationCommand } from './abstract-location.command';
import type { ReverseQueryInterface } from '../interface';

export class ReverseCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractLocationCommand<
    ReverseQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof ReverseQuery {
        return ReverseQuery;
    }
}

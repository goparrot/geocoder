import { ReverseQueryInterface } from '../interface';
import { ReverseQuery } from '../model';
import { AbstractLocationCommand } from './abstract-location.command';

export class ReverseCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractLocationCommand<
    ReverseQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    get queryClass(): typeof ReverseQuery {
        return ReverseQuery;
    }
}

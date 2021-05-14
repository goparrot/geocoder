import { DistanceQuery } from '../model/distance-query';
import { AbstractCommand } from './abstract.command';
import type { AxiosResponse } from 'axios';
import type { DistanceQueryInterface } from '../interface';
import type { Distance } from '../model';
import type { AbstractDistanceTransformer } from '../transformer';

export class DistanceCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractCommand<
    DistanceQueryInterface,
    Distance,
    AbstractDistanceTransformer,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof DistanceQuery {
        return DistanceQuery;
    }

    async execute(query: DistanceQueryInterface): Promise<Distance[]> {
        return super.execute(query);
    }

    protected async parseResponse(_response: AxiosResponse<ProviderResponseType>, _query: DistanceQueryInterface): Promise<AbstractDistanceTransformer[]> {
        throw new Error('DistanceCommand.parseResponse: not implemented');
    }
}

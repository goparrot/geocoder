import { NotFoundException } from '../exception';
import { PlaceDetailsQuery } from '../model';
import { AbstractLocationCommand } from './abstract-location.command';
import type { PlaceDetailsQueryInterface } from '../interface';
import type { Location } from '../model';
import type { AbstractLocationTransformer } from '../transformer';

export class PlaceDetailsCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractLocationCommand<
    PlaceDetailsQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof PlaceDetailsQuery {
        return PlaceDetailsQuery;
    }

    async execute(query: PlaceDetailsQueryInterface): Promise<Location[]> {
        const locations: Location[] = await super.execute(query);

        locations.map((location: Location) => {
            if (!location.placeId) {
                location.placeId = query.placeId;
            }

            return location;
        });

        if (locations.length !== 1) {
            throw new NotFoundException(`Place by id "${query.placeId}" not found`);
        }

        return locations;
    }

    protected async parseOneResult<ProviderRawEntryType = any, ProviderLocationTransformer extends AbstractLocationTransformer = any>(
        _raw: ProviderRawEntryType,
    ): Promise<ProviderLocationTransformer> {
        throw new Error('PlaceDetailsCommand.parseOneResult: not implemented');
    }
}

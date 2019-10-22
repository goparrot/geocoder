import { NotFoundException } from '../exception';
import { PlaceDetailsQueryInterface } from '../interface';
import { Location, LocationBuilder, PlaceDetailsQuery } from '../model';
import { AbstractLocationCommand } from './abstract-location.command';

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

    protected async parseOneResult(_raw: any): Promise<LocationBuilder> {
        throw new Error('PlaceDetailsCommand.parseOneResult: not implemented');
    }
}

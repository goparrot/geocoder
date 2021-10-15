import { LoggableMixin } from '../logger';
import type {
    DistanceQueryInterface,
    GeocodeQueryInterface,
    PlaceDetailsQueryInterface,
    ProviderInterface,
    ReverseQueryInterface,
    SuggestQueryInterface,
} from '../interface';
import type { Distance } from './distance';
import type { Location } from './location';
import type { Suggestion } from './suggestion';

export class AbstractProvider extends LoggableMixin(Object) implements ProviderInterface {
    async geocode(_query: GeocodeQueryInterface): Promise<Location[]> {
        throw new Error('AbstractProvider.geocode: not implemented');
    }

    async reverse(_query: ReverseQueryInterface): Promise<Location[]> {
        throw new Error('AbstractProvider.reverse: not implemented');
    }

    async suggest(_query: SuggestQueryInterface): Promise<Suggestion[]> {
        throw new Error('AbstractProvider.suggest: not implemented');
    }

    async placeDetails(_query: PlaceDetailsQueryInterface): Promise<Location> {
        throw new Error('AbstractProvider.placeDetails: not implemented');
    }

    async distance(_query: DistanceQueryInterface): Promise<Distance> {
        throw new Error('AbstractProvider.distance: not implemented');
    }
}

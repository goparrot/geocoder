import { GeocodeQueryInterface, ProviderInterface, ReverseQueryInterface } from '../interface';
import { LoggableMixin } from '../logger';
import { Location } from './location';

export abstract class AbstractProvider extends LoggableMixin(Object) implements ProviderInterface {
    protected constructor() {
        super();
    }

    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;
}

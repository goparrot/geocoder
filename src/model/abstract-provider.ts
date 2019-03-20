import { GeocodeQueryInterface, ProviderInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggableMixin } from '../logger';
import { Location } from './location';
import { Suggestion } from './suggestion';

export abstract class AbstractProvider extends LoggableMixin(Object) implements ProviderInterface {
    protected constructor() {
        super();
    }

    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;

    abstract async suggest(query: SuggestQueryInterface): Promise<Suggestion[]>;
}

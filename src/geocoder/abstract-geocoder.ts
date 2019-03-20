import { GeocodeQueryInterface, GeocoderInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggableMixin } from '../logger';
import { AbstractProvider, Location, Suggestion } from '../model';

export abstract class AbstractGeocoder extends LoggableMixin(Object) implements GeocoderInterface {
    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;

    abstract async suggest(query: SuggestQueryInterface): Promise<Suggestion[]>;

    protected async geocodeByProvider(provider: AbstractProvider, query: GeocodeQueryInterface): Promise<Location[]> {
        return provider.geocode(query);
    }

    protected async reverseByProvider(provider: AbstractProvider, query: ReverseQueryInterface): Promise<Location[]> {
        return provider.reverse(query);
    }

    protected async suggestByProvider(provider: AbstractProvider, query: SuggestQueryInterface): Promise<Suggestion[]> {
        return provider.suggest(query);
    }
}

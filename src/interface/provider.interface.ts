import { Location, Suggestion } from '../model';
import { GeocodeQueryInterface } from './geocode-query.interface';
import { ReverseQueryInterface } from './reverse-query.interface';
import { SuggestQueryInterface } from './suggest-query.interface';

export interface ProviderInterface {
    geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    reverse(query: ReverseQueryInterface): Promise<Location[]>;

    suggest(query: SuggestQueryInterface): Promise<Suggestion[]>;
}

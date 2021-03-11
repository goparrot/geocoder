import type { Location, Suggestion } from '../model';
import type { GeocodeQueryInterface } from './geocode-query.interface';
import type { ReverseQueryInterface } from './reverse-query.interface';
import type { SuggestQueryInterface } from './suggest-query.interface';

export interface GeocoderInterface {
    geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    reverse(query: ReverseQueryInterface): Promise<Location[]>;

    suggest(query: SuggestQueryInterface): Promise<Suggestion[]>;
}

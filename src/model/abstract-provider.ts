import { GeocodeQuery } from './geocode-query';
import { Location } from './location';
import { ReverseQuery } from './reverse-query';

export abstract class AbstractProvider {
    abstract async geocode(query: GeocodeQuery): Promise<Location[]>;

    abstract async reverse(query: ReverseQuery): Promise<Location[]>;
}

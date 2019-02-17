import { Address } from './address';
import { GeocodeQuery } from './geocode-query';
import { ReverseQuery } from './reverse-query';

export abstract class AbstractProvider {
    abstract async geocode(query: GeocodeQuery): Promise<Address[]>;

    abstract async reverse(query: ReverseQuery): Promise<Address[]>;
}

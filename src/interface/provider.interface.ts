import { Address } from '../model/address';
import { GeocodeQuery } from '../model/geocode-query';
import { ReverseQuery } from '../model/reverse-query';

export interface ProviderInterface {
    geocode(query: GeocodeQuery): Promise<Address[]>;

    reverse(query: ReverseQuery): Promise<Address[]>;
}

import { GeocodeQuery } from '../model/geocode-query';
import { Location } from '../model/location';
import { ReverseQuery } from '../model/reverse-query';

export interface ProviderInterface {
    geocode(query: GeocodeQuery): Promise<Location[]>;

    reverse(query: ReverseQuery): Promise<Location[]>;
}

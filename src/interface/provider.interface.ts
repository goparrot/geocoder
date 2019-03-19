import { Location } from '../model';
import { GeocodeQueryInterface } from './geocode-query.interface';
import { ReverseQueryInterface } from './reverse-query.interface';

export interface ProviderInterface {
    geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    reverse(query: ReverseQueryInterface): Promise<Location[]>;
}

import { GeocodeQueryInterface, ReverseQueryInterface } from '.';
import { Address } from '../model';

export interface GeocoderInterface {
    geocode(query: GeocodeQueryInterface): Promise<Address[]>;
    reverse(query: ReverseQueryInterface): Promise<Address[]>;
}

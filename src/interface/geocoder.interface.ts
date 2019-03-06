import { GeocodeQueryInterface, ReverseQueryInterface } from '.';
import { Location } from '../model';

export interface GeocoderInterface {
    geocode(query: GeocodeQueryInterface): Promise<Location[]>;
    reverse(query: ReverseQueryInterface): Promise<Location[]>;
}

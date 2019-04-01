import { Location } from '../model';
import { GeocoderInterface } from './geocoder.interface';
import { PlaceDetailsQueryInterface } from './place-details-query.interface';

export interface ProviderInterface extends GeocoderInterface {
    placeDetails(query: PlaceDetailsQueryInterface): Promise<Location>;
}

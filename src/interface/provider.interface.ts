import type { Location } from '../model';
import type { GeocoderInterface } from './geocoder.interface';
import type { PlaceDetailsQueryInterface } from './place-details-query.interface';

export interface ProviderInterface extends GeocoderInterface {
    placeDetails(query: PlaceDetailsQueryInterface): Promise<Location>;
}

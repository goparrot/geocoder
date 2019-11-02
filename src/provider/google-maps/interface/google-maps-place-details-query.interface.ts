import { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsPlaceDetailsQueryInterface extends GoogleMapsQueryInterface {
    placeid: string;
}

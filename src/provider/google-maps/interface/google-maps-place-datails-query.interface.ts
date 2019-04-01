import { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsPlaceDatailsQueryInterface extends GoogleMapsQueryInterface {
    placeid: string;
}

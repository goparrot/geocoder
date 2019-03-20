import { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsReverseQueryInterface extends GoogleMapsQueryInterface {
    latlng: string;
    limit: number;
}

import type { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsGeocodeQueryInterface extends GoogleMapsQueryInterface {
    address: string;
    components: string;
    limit: number;
}

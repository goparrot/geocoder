import { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsPlaceDetailsQueryInterface extends GoogleMapsQueryInterface {
    placeid: string;
    /**
     * Warning: If you do not specify at least one field with a request,
     * or if you omit the fields parameter from a request, ALL possible fields will be returned,
     * and you will be billed accordingly. This applies only to Place Details requests.
     *
     * @link https://developers.google.com/places/web-service/details
     * @link https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
     */
    fields?: string;
}

import { HereQueryInterface } from './here-query.interface';

export interface HereGeocodeQueryInterface extends HereQueryInterface {
    searchtext: string;
    postalcode?: string;
    /**
     * ISO 3166-1-alpha-3
     */
    country?: string;
    state?: string;
    city?: string;

    /**
     * @example "lat,lon,radius"
     */
    prox?: string;
}

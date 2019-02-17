import { QueryInterface } from './query.interface';

export interface GeocodeQueryInterface extends QueryInterface {
    address: string;
    country?: string;
    /**
     * ISO 3166-1 alpha-2
     */
    countryCode?: string;
    state?: string;
    /**
     * ISO 3166-1 alpha-2
     */
    stateCode?: string;
    city?: string;
    postalCode?: string;
}

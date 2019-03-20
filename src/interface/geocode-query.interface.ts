import { QueryInterface } from './query.interface';

export interface GeocodeQueryInterface extends QueryInterface {
    /**
     * Main required search field
     */
    address: string;

    /**
     * @default not applicable
     */
    country?: string;

    /**
     * @default not applicable
     */
    state?: string;

    /**
     * ISO 3166-1 alpha-2
     *
     * @default not applicable
     */
    stateCode?: string;

    /**
     * @default not applicable
     */
    city?: string;

    /**
     * @default not applicable
     */
    postalCode?: string;
}

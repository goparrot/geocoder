import { QueryInterface } from './query.interface';

export interface GeocodeQueryInterface extends QueryInterface {
    /**
     * Main required search field
     */
    address: string;

    /**
     * This query option is suitable for those who have an exact formatted address and needs to get the geo-data of this address.
     * Currently this option only works if accuracy is not specified or it is set to AccuracyEnum.HOUSE_NUMBER
     * and if query limit is not specified or it is more then one, otherwise ValidationException will be thrown.
     *
     * If a provider returns more than one possible option, then ExactMatchNotFoundException will be thrown.
     *
     * If the provider returns only one result and the optional countryCode and stateCode options are passed in the query,
     * the result will be checked to match with this query options and if they do not match, then ExactMatchNotFoundException will be thrown.
     *
     * If successful, an array with one element will be returned.
     *
     * @default false
     */
    exactMatch?: boolean;

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

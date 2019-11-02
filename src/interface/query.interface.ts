import { AccuracyEnum } from '../model';

export interface QueryInterface {
    /**
     * @important Provider classes MUST implement this option, if api provider supports it.
     * @important Additionally, the logic for this option is executed after the data is received and returned from the provider class.
     *
     * If you want to get a result that contains values in all the fields you need, then specify the minimum level of accuracy.
     * @example If you have enough general information, such as: country, state and city, then specify the value `AccuracyEnum.CITY`
     * @example If you want to get the result only if the data contains all the information, up to the house number, specify the AccuracyEnum.HOUSE_NUMBER.
     *
     * @default not applicable
     */
    accuracy?: AccuracyEnum;

    /**
     * @important Provider classes MUST implement this option, if api provider supports it.
     * ISO 3166-1 alpha-2
     *
     * @default not applicable
     */
    countryCode?: string;

    /**
     * @important This option should not passed to the provider request.
     * @important Additionally, the logic for this option is executed after the data is received and returned from the provider class.
     *
     * @default {Query.DEFAULT_RESULT_LIMIT}
     */
    limit?: number;

    /**
     * @important Provider classes MUST implement this option, if api provider supports it.
     * @important Additionally, the logic for this option is executed after the data is received and returned from the provider class and filtered by accuracy.
     *
     * @default {Query.DEFAULT_RESULT_LANGUAGE}
     */
    language?: string;

    /**
     * This option will be useful to those who want to get additional data that the library cannot provide with a common interface.
     *
     * If true - AbstractTransformer additionally returns result with the original provider data in the `raw` property
     *
     * @default false
     */
    withRaw?: boolean;

    /**
     * TODO not implemented
     *
     * Auto fill undefined optional query properties countryCode and stateCode using other optional properties: country, countryCode
     * @example You provide country
     * The library will search for countryCode by country name.
     * If it finds a match, it will substitute the value for countryCode in the current query
     *
     * @example You provide country/countryCode and state
     * The library will search stateCode by country/countryCode and state name.
     * If it finds a match, substitute the stateCode value in the current request.
     *
     * @default true
     */
    fillMissingQueryProperties?: boolean;
}

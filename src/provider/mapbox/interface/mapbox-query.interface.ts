export interface MapboxQueryInterface {
    access_token?: string;

    /**
     * Limit results to one or more countries. Permitted values are ISO 3166 alpha 2 country codes separated by commas.
     */
    countries?: string[];

    /**
     * Filter results by one or more feature types
     */
    types?: string; // MapboxGeocodeQueryType[];

    /**
     * Specify the language to use for response text and, for forward geocoding, query result weighting.
     * Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more
     * IETF subtags for country or script.
     */
    language?: string;

    /**
     * Specify the maximum number of results to return. The default is 5 and the maximum supported is 10.
     */
    limit?: number;
}

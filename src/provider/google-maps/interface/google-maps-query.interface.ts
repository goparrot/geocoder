export interface GoogleMapsQueryInterface {
    sensor?: boolean;
    key: string;
    /**
     * Country code used to bias the search, specified as a Unicode region subtag / CLDR identifier. Optional.
     * https://developers.google.com/maps/documentation/geocoding/intro#RegionCodes
     */
    region?: string;
    language: string;
}

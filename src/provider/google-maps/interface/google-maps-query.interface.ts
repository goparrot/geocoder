export interface GoogleMapsQueryInterface {
    sensor: boolean;
    key: string;
    /**
     * Country code used to bias the search, specified as a Unicode region subtag / CLDR identifier. Optional.
     */
    region?: string;
    limit: number;
    language: string;
}

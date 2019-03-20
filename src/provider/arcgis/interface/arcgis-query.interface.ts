export interface ArcgisQueryInterface {
    token?: string;
    /**
     * ArcGIS Online service credits are deducted from the organization account for
     * each geocode transaction that includes the forStorage parameter with a value of true and a valid token.
     * Refer to the ArcGIS Online service credits overview page for more information on how credits are charged.
     *
     * Refer to the ArcGIS Online service credits overview page for more information on how credits are charged.
     * http://www.esri.com/SOFTWARE/ARCGIS/ARCGISONLINE/CREDITS
     *
     * To learn more about free and paid geocoding operations, see Free vs. paid operations.
     * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-free-vs-paid.htm
     */
    forStorage: boolean;
    langCode: string;
    f: 'json';
}

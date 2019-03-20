/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm#ESRI_SECTION1_606D93C721874B16844B9AB9CA8083FF}
 */
import { ArcgisQueryInterface } from './arcgis-query.interface';

export interface ArcgisSuggestQueryInterface extends ArcgisQueryInterface {
    text: string;
    /**
     * Boost geocoding candidates based on their proximity to the location.
     * @example -117.196,34.056
     */
    location?: string;
    /**
     * Something like accuracy
     * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B}
     */
    category: 'Point Address' | 'Street Address' | 'Street Name' | 'Subaddress' | 'Postal' | string;
    /**
     * Acceptable values include the full country name in English or the official language of the country,
     * the 2-character country code or the 3-character country code.
     * A list of supported countries and codes is available in the Geocode coverage topic.
     * https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm
     */
    countryCode?: string;
    maxSuggestions: number;
    isCollection?: boolean;
}

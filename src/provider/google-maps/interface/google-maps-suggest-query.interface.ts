import type { GoogleMapsQueryInterface } from './google-maps-query.interface';

export interface GoogleMapsSuggestQueryInterface extends GoogleMapsQueryInterface {
    input: string;
    /**
     * A grouping of places to which you would like to restrict your results.
     * Currently, you can use components to filter by up to 5 countries.
     * Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code
     */
    components?: string;
    /**
     * The types of place results to return. See Place Types below. If no type is specified, all types will be returned.
     * @link {https://developers.google.com/places/web-service/autocomplete#place_types}
     */
    types?: 'geocode' | 'address' | 'establishment' | '(regions)' | '(cities)' | string;
    /**
     * The point around which you wish to retrieve place information. Must be specified as latitude,longitude.
     */
    location?: string;
    /**
     * The distance (in meters) within which to return place results.
     * Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.
     */
    radius?: number;
    /**
     * Returns only those places that are strictly within the region defined by location and radius.
     * This is a restriction, rather than a bias, meaning that results outside this region will not be returned even if they match the user input.
     */
    strictbounds?: boolean;
}

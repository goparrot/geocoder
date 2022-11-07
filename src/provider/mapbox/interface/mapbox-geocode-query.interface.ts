import type { MapboxQueryInterface } from './mapbox-query.interface';
import type { MapboxGeocodeMode } from './mapbox.type';

export interface MapboxGeocodeQueryInterface extends MapboxQueryInterface {
    /**
     * Either mapbox.places for ephemeral geocoding, or mapbox.places-permanent for storing results and batch geocoding.
     */
    mode: MapboxGeocodeMode;

    /**
     * A location. This will be a place name for forward geocoding or a coordinate pair (longitude, latitude) for reverse geocoding.
     */
    query: string;

    /**
     * Forward geocoding only. Return autocomplete results or not. Options are  true or  false and the default is  true .
     */
    autocomplete?: boolean;

    /**
     * Specify the maximum number of results to return. The default is 5 and the maximum supported is 10.
     */
    limit?: number;
}

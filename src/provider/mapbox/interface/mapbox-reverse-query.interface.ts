import type { MapboxQueryInterface } from './mapbox-query.interface';
import type { MapboxGeocodeMode } from './mapbox.type';

export interface MapboxReverseQueryInterface extends MapboxQueryInterface {
    /**
     * Either mapbox.places for ephemeral geocoding, or mapbox.places-permanent for storing results and batch geocoding.
     */
    mode: MapboxGeocodeMode;

    lon: number;
    lat: number;

    routing?: boolean;
}

import type { GoogleMapsQueryInterface } from './google-maps-query.interface';

/**
 * @see {@link https://developers.google.com/maps/documentation/distance-matrix/overview#DistanceMatrixRequests}
 */
export interface GoogleMapsDistanceQueryInterface extends GoogleMapsQueryInterface {
    /**
     * The starting point for calculating travel distance and time
     */
    origins: string;
    /**
     * The finishing point for calculating travel distance and time
     */
    destinations: string;
    /**
     * @see {@link https://developers.google.com/maps/documentation/distance-matrix/overview#travel_modes}
     */
    mode?: 'driving' | 'walking' | 'bicycling';
}

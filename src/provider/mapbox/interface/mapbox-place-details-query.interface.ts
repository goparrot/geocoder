import type { MapboxQueryInterface } from './mapbox-query.interface';

export interface MapboxPlaceDetailsQueryInterface extends MapboxQueryInterface {
    query: string;
}

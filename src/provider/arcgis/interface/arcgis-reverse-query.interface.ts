import type { ArcgisQueryInterface } from './arcgis-query.interface';

export interface ArcgisReverseQueryInterface extends ArcgisQueryInterface {
    location: string;
    // The featureTypes parameter can be used to specify one or more match types to be returned by a reverseGeocode request
    featureTypes?: 'StreetInt' | 'DistanceMarker' | 'StreetAddress' | 'POI' | 'PointAddress' | 'Postal' | 'Locality' | string;
    maxLocations: number;
    locationType: 'rooftop' | 'street';
}

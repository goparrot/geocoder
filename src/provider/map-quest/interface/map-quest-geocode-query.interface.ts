import type { MapQuestQueryInterface } from './map-quest-query.interface';

export interface MapQuestGeocodeQueryInterface extends MapQuestQueryInterface {
    maxResults: number;
    location: string;
    thumbMaps: boolean;
    outFormat: string;
    country?: string;
    state?: string;
}

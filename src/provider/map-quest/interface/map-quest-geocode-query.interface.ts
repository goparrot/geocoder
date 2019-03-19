import { MapQuestQueryInterface } from './map-quest-query.interface';

export interface MapQuestGeocodeQueryInterface extends MapQuestQueryInterface {
    maxResults: number;
    country?: string;
    state?: string;
}

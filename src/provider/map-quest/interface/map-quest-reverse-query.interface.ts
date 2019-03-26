import { MapQuestQueryInterface } from './map-quest-query.interface';

export interface MapQuestReverseQueryInterface extends MapQuestQueryInterface {
    location: string;
    thumbMaps: boolean;
    outFormat: string;
}

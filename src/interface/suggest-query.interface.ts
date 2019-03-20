import { GeocodeQueryInterface } from './geocode-query.interface';

export interface SuggestQueryInterface extends GeocodeQueryInterface {
    lat?: number;
    lon?: number;
    radius?: number;
}

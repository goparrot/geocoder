import type { QueryInterface } from './query.interface';

export interface ReverseQueryInterface extends QueryInterface {
    lat: number;
    lon: number;
}

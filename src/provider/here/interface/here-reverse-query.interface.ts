import type { HereQueryInterface } from './here-query.interface';

export interface HereReverseQueryInterface extends HereQueryInterface {
    /**
     * @example "lat,lon,radius"
     */
    prox: string;
    mode: string;
}

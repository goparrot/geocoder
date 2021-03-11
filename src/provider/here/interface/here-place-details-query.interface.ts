import type { HereQueryInterface } from './here-query.interface';

export interface HerePlaceDetailsQueryInterface extends HereQueryInterface {
    locationid: string;
}

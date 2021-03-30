import type { TravelModeEnum, Point } from '../model';
import type { QueryInterface } from './query.interface';

export interface DistanceQueryInterface extends QueryInterface {
    from: Point;

    to: Point;

    /**
     * @default TravelModeEnum.DRIVING
     */
    mode?: TravelModeEnum;
}

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import type { DistanceQueryInterface } from '../interface';
import { TravelModeEnum } from './travel-mode.enum';
import { Point } from './point';
import { Query } from './query';

export class DistanceQuery extends Query implements DistanceQueryInterface {
    @Type(() => Point)
    @ValidateNested()
    from: Point;

    @Type(() => Point)
    @ValidateNested()
    to: Point;

    @IsEnum(TravelModeEnum)
    @IsOptional()
    mode?: TravelModeEnum = TravelModeEnum.DRIVING;
}

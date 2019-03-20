import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { SuggestQueryInterface } from '../interface';
import { GeocodeQuery } from './geocode-query';

export class SuggestQuery extends GeocodeQuery implements SuggestQueryInterface {
    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    lat?: number;

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    lon?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    @Type(() => Number)
    radius?: number;
}

import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { ReverseQueryInterface } from '../interface';
import { Query } from './query';

export class ReverseQuery extends Query implements ReverseQueryInterface {
    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    lon: number;
}

import { IsNumber, Max, Min } from 'class-validator';
import { Query } from './query';
import type { ReverseQueryInterface } from '../interface';

export class ReverseQuery extends Query implements ReverseQueryInterface {
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    lon: number;
}

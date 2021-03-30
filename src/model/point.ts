import { Exclude, Expose } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

@Exclude()
export class Point {
    @Expose()
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @Expose()
    @IsNumber()
    @Min(-180)
    @Max(180)
    lon: number;
}

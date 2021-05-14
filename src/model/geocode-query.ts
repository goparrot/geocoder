import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ToBoolean } from '../util/transformer';
import { IsExactMatchApplicable } from '../validation';
import type { GeocodeQueryInterface } from '../interface';
import { Query } from './query';

export class GeocodeQuery extends Query implements GeocodeQueryInterface {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    address: string;

    @ToBoolean()
    @IsExactMatchApplicable()
    exactMatch: boolean = false;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    country?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    state?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    stateCode?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    city?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    postalCode?: string;

    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat?: number;

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    lon?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    radius?: number;
}

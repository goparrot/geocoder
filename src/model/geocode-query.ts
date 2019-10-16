import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { GeocodeQueryInterface } from '../interface';
import { IsExactMatchApplicable } from '../validation';
import { Query } from './query';

export class GeocodeQuery extends Query implements GeocodeQueryInterface {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    @Type(() => String)
    address: string;

    @IsExactMatchApplicable()
    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    @Type(() => Boolean)
    exactMatch: boolean = false;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Type(() => String)
    country?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Type(() => String)
    state?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    stateCode?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Type(() => String)
    city?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @Type(() => String)
    postalCode?: string;

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

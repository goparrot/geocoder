import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { GeocodeQueryInterface } from '../interface';
import { Query } from './query';

export class GeocodeQuery extends Query implements GeocodeQueryInterface {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    @Type(() => String)
    address: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Type(() => String)
    country?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    countryCode?: string;

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
}

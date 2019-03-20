import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { GeocodeQueryInterface } from '../interface';
import { IsExactMatchApplicable } from '../validation';
import { Query } from './query';

export class GeocodeQuery extends Query implements GeocodeQueryInterface {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
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
}

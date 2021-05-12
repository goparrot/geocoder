import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { WorldCountryQueryInterface } from './world-country-query.interface';

@Exclude()
export class WorldCountryQuery implements WorldCountryQueryInterface {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Transform(({ value }) => value?.trim())
    @Expose()
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Transform(({ value }) => value?.toString().trim().toUpperCase())
    @Expose()
    cca2?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @Transform(({ value }) => value?.toString().trim().toUpperCase())
    @Expose()
    cca3?: string;

    @IsOptional()
    @IsInt()
    @IsNumberString()
    @MinLength(3)
    @MaxLength(3)
    @Transform(({ value }) => (value ? (+value).toString().trim().padStart(3, '0') : undefined))
    @Expose()
    ccn3?: string | number;
}

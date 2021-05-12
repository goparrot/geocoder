import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { WorldCountryStateQueryInterface } from './world-country-state-query.interface';

@Exclude()
export class WorldCountryStateQuery implements WorldCountryStateQueryInterface {
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Transform(({ value }) => value?.trim())
    @Expose()
    countryCode: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({ value }) => value?.toString().trim().toUpperCase())
    @Expose()
    stateCode?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @Transform(({ value }) => value?.trim())
    @Expose()
    name?: string;
}

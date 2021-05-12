import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { WorldCountryStateInterface } from './world-country-state.interface';

@Exclude()
export class WorldCountryState implements WorldCountryStateInterface {
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Transform(({ value }) => value?.toString().trim().toUpperCase())
    @Expose()
    countryCode: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({ value }) => value?.toString().trim().toUpperCase())
    @Expose()
    stateCode: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toString().trim())
    @Expose()
    name: string;
}

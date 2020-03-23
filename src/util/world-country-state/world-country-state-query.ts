import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { WorldCountryStateQueryInterface } from './world-country-state-query.interface';

@Exclude()
export class WorldCountryStateQuery implements WorldCountryStateQueryInterface {
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Transform((v: string) => v.trim())
    @Expose()
    countryCode: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Transform((v: string) => (v ? v.toString().trim().toUpperCase() : undefined))
    @Expose()
    stateCode?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @Transform((v: string) => (v ? v.trim() : undefined))
    @Expose()
    name?: string;
}

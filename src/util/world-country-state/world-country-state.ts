import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { WorldCountryStateInterface } from './world-country-state.interface';

@Exclude()
export class WorldCountryState implements WorldCountryStateInterface {
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    @Transform((v: string) =>
        v
            .toString()
            .trim()
            .toUpperCase(),
    )
    @Expose()
    countryCode: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    @Transform((v: string) =>
        v
            .toString()
            .trim()
            .toUpperCase(),
    )
    @Expose()
    stateCode: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @Transform((v: string) => v.toString().trim())
    @Expose()
    name: string;
}

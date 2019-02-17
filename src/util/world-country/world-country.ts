import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { WorldCountryName } from './world-country-name';
import { WorldCountryInterface } from './world-country.interface';

@Exclude()
export class WorldCountry implements WorldCountryInterface {
    @IsOptional()
    @Type(() => WorldCountryName)
    @Expose()
    name: WorldCountryName;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    @Expose()
    cca2: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @Type(() => String)
    @Expose()
    cca3: string;

    @IsOptional()
    @IsString()
    @IsNumberString()
    @MinLength(3)
    @MaxLength(3)
    @Type(() => String)
    @Expose()
    ccn3: string;
}

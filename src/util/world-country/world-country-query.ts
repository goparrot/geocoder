import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { WorldCountryQueryInterface } from './world-country-query.interface';

@Exclude()
export class WorldCountryQuery implements WorldCountryQueryInterface {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Type(() => String)
    @Transform((v: string) => (v ? v.trim() : undefined))
    @Expose()
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    @Transform((v: string) =>
        v
            ? v
                  .toString()
                  .trim()
                  .toUpperCase()
            : undefined,
    )
    @Expose()
    cca2?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @Type(() => String)
    @Transform((v: string) =>
        v
            ? v
                  .toString()
                  .trim()
                  .toUpperCase()
            : undefined,
    )
    @Expose()
    cca3?: string;

    @IsOptional()
    @IsInt()
    @IsNumberString()
    @MinLength(3)
    @MaxLength(3)
    @Type(() => String)
    @Transform((v: number | string) =>
        v
            ? (+v)
                  .toString()
                  .trim()
                  .padStart(3, '0')
            : undefined,
    )
    @Expose()
    ccn3?: string | number;
}

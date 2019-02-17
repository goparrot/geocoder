import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class WorldCountryName {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Type(() => String)
    @Expose()
    common: string;
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Type(() => String)
    @Expose()
    official: string;
}

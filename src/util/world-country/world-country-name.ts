import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class WorldCountryName {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Expose()
    common: string;
    @IsString()
    @IsOptional()
    @MinLength(1)
    @Expose()
    official: string;
}

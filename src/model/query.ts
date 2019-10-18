import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { QueryInterface } from '../interface';
import { AccuracyEnum } from './accuracy.enum';

export class Query implements QueryInterface {
    static readonly DEFAULT_RESULT_LIMIT: number = 5;
    static readonly DEFAULT_RESULT_LANGUAGE: string = 'en';

    @IsOptional()
    @IsEnum(AccuracyEnum)
    accuracy?: AccuracyEnum;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    countryCode?: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    limit: number = Query.DEFAULT_RESULT_LIMIT;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    language: string = Query.DEFAULT_RESULT_LANGUAGE;

    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    fillMissingQueryProperties: boolean = true;

    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    withRaw: boolean = false;
}

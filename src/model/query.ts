import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { QueryInterface } from '../interface';

/**
 * Must be sorted from maximum to minimum accuracy
 */
export enum AccuracyEnum {
    HOUSE_NUMBER = 'houseNumber',
    STREET_NAME = 'streetName',
    CITY = 'city',
    STATE = 'state',
    COUNTRY = 'country',
}

export class Query implements QueryInterface {
    static readonly DEFAULT_RESULT_LIMIT: number = 5;
    static readonly DEFAULT_RESULT_LANGUAGE: string = 'en';

    @IsOptional()
    @IsEnum(AccuracyEnum)
    @Type(() => String)
    accuracy?: AccuracyEnum;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    countryCode?: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number = Query.DEFAULT_RESULT_LIMIT;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @Type(() => String)
    language: string = Query.DEFAULT_RESULT_LANGUAGE;

    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    @Type(() => Boolean)
    fillMissingQueryProperties: boolean = true;

    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    @Type(() => Boolean)
    withRaw: boolean = false;
}

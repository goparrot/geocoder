import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export enum AccuracyEnum {
    HOUSE_NUMBER = 'houseNumber',
    STREET_NAME = 'streetName',
    CITY = 'city',
    STATE = 'state',
    COUNTRY = 'country',
}

export class Query {
    static readonly DEFAULT_RESULT_LIMIT: number = 5;
    static readonly DEFAULT_RESULT_LANGUAGE: string = 'en';

    /**
     * @important Provider classes MUST implement this option, if api provider supports it.
     * @important Additionally, the logic for this option is executed after the data is received and returned from the provider class.
     *
     * If you want to get a result that contains values in all the fields you need, then specify the minimum level of accuracy.
     * @example If you have enough general information, such as: country, state and city, then specify the value `AccuracyEnum.CITY`
     * @example If I want to receive relatsat only if the data contains all the information, in the flesh to the house number, then specify the value AccuracyEnum.HOUSE_NUMBER
     * @default not applicable
     */
    @IsOptional()
    @IsEnum(AccuracyEnum)
    @Type(() => String)
    accuracy?: AccuracyEnum;

    /**
     * @important Provider classes MUST implement this option, if api provider supports it.
     * @important Additionally, the logic for this option is executed after the data is received and returned from the provider class and filtered by accuracy.
     */
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

    /**
     * TODO not implemented
     *
     * Auto fill undefined optional query properties using other optional properties: country, countryCode, postalCode
     * @example You provide country
     * Library search countryCode and postalCode by country
     *
     * @example You provide state
     * Library search country, countryCode, stateCode and postalCode by country
     */
    @IsBoolean()
    @Transform((v: boolean) => !!v, { toClassOnly: true })
    @Type(() => Boolean)
    fillMissingQueryProperties: boolean = true;
}

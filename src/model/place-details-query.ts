import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { QueryInterface } from '../interface';
import { Query } from './query';

export class PlaceDetailsQuery extends Query implements QueryInterface {
    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    @Type(() => String)
    placeId: string;
}

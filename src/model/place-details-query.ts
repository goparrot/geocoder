import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PlaceDetailsQueryInterface } from '../interface';
import { Query } from './query';

export class PlaceDetailsQuery extends Query implements PlaceDetailsQueryInterface {
    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    placeId: string;
}

import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Query } from './query';
import type { PlaceDetailsQueryInterface } from '../interface';

export class PlaceDetailsQuery extends Query implements PlaceDetailsQueryInterface {
    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    placeId: string;
}

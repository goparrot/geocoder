import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { LocationInterface } from '../interface';
import { AbstractBuilder } from './abstract-builder';
import { AbstractHttpProvider } from './abstract-http-provider';
import { Location } from './location';

export class LocationBuilder<T extends AbstractHttpProvider = any, R = any> extends AbstractBuilder<T, R> implements LocationInterface<R> {
    latitude: number;
    longitude: number;
    formattedAddress?: string;
    country: string;
    countryCode: string;
    state?: string;
    stateCode?: string;
    city?: string;
    streetName?: string;
    houseNumber?: string;
    postalCode?: string;
    placeId?: string;

    async build(options?: ClassTransformOptions): Promise<Location<R>> {
        const location: Location = plainToClass<Location<R>, LocationInterface<R>>(Location, this, options);

        if (!location.formattedAddress) {
            location.formattedAddress = location.generateFormattedAddress();
        }

        return location;
    }
}

import { plainToClass } from 'class-transformer';
import { LocationInterface } from '../interface';
import { Type } from '../types';
import { AbstractHttpProvider } from './abstract-http-provider';
import { Location } from './location';

export class LocationBuilder<T extends AbstractHttpProvider = any, R = any> implements LocationInterface<R> {
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

    readonly provider: string;

    constructor(readonly providerClass: Type<T>, readonly raw: R) {
        this.provider = this.providerClass.name;
    }

    async build(): Promise<Location> {
        const location: Location = plainToClass(Location, this);

        if (!location.formattedAddress) {
            location.formattedAddress = location.generateFormattedAddress();
        }

        return location;
    }
}

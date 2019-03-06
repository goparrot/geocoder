import { plainToClass } from 'class-transformer';
import { LocationInterface, Type } from '../interface';
import { AbstractHttpProvider } from './abstract-http-provider';
import { Location } from './location';

export class LocationBuilder<T extends AbstractHttpProvider = any> implements LocationInterface {
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
    provider: string;

    constructor(private readonly providerClass: Type<T>) {}

    build(): Location {
        this.provider = this.providerClass.name;

        const location: Location = plainToClass(Location, this);

        if (!location.formattedAddress) {
            location.formattedAddress = location.generateFormattedAddress();
        }

        return location;
    }
}

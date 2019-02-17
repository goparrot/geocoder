import { plainToClass } from 'class-transformer';
import { AddressInterface, Type } from '../interface';
import { AbstractHttpProvider } from './abstract-http-provider';
import { Address } from './address';

export class AddressBuilder<T extends AbstractHttpProvider = any> implements AddressInterface {
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

    build(): Address {
        this.provider = this.providerClass.name;

        const address: Address = plainToClass(Address, this);

        if (!address.formattedAddress) {
            address.formattedAddress = address.getFormattedAddress();
        }

        return address;
    }
}

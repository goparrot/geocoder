import { plainToInstance } from 'class-transformer';
import type { ClassTransformOptions } from 'class-transformer';
import { WorldCountryUtil } from '../util/world-country';
import { Location } from '../model';
import type { LocationInterface } from '../interface';
import type { AbstractHttpProvider } from '../model';
import type { WorldCountry, WorldCountryQueryInterface } from '../util/world-country';
import { AbstractTransformer } from './abstract-transformer';

export abstract class AbstractLocationTransformer<HttpProviderClass extends AbstractHttpProvider = any, ProviderRawEntryType = any> extends AbstractTransformer<
    HttpProviderClass,
    ProviderRawEntryType
> {
    abstract getFormattedAddress(): Promise<LocationInterface['formattedAddress']>;
    abstract getLongitude(): Promise<LocationInterface['longitude']>;
    abstract getLatitude(): Promise<LocationInterface['latitude']>;
    abstract getCountry(): Promise<LocationInterface['country']>;
    abstract getCountryCode(): Promise<LocationInterface['countryCode']>;
    abstract getState(): Promise<LocationInterface['state']>;
    abstract getStateCode(): Promise<LocationInterface['stateCode']>;
    abstract getCity(): Promise<LocationInterface['city']>;
    abstract getStreetName(): Promise<LocationInterface['streetName']>;
    abstract getHouseNumber(): Promise<LocationInterface['houseNumber']>;
    abstract getPostalCode(): Promise<LocationInterface['postalCode']>;
    abstract getPlaceId(): Promise<LocationInterface['placeId']>;

    async transform(options?: ClassTransformOptions): Promise<Location<ProviderRawEntryType>> {
        const location: Location = new Location<ProviderRawEntryType>();

        location.provider = this.provider;
        location.formattedAddress = await this.getFormattedAddress();
        location.longitude = await this.getLongitude();
        location.latitude = await this.getLatitude();
        location.country = await this.getCountry();
        location.countryCode = await this.getCountryCode();
        location.state = await this.getState();
        location.stateCode = await this.getStateCode();
        location.city = await this.getCity();
        location.streetName = await this.getStreetName();
        location.houseNumber = await this.getHouseNumber();
        location.postalCode = await this.getPostalCode();
        location.placeId = await this.getPlaceId();
        location.raw = this.raw;

        if (!location.formattedAddress) {
            location.formattedAddress = location.generateFormattedAddress();
        }

        return plainToInstance<Location<ProviderRawEntryType>, LocationInterface<ProviderRawEntryType>>(Location, location, options);
    }

    protected async getWorldCountry(query: WorldCountryQueryInterface): Promise<WorldCountry | undefined> {
        return WorldCountryUtil.find(query);
    }
}

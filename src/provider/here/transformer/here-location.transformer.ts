import { AbstractLocationTransformer } from '../../../transformer';
import { HereProvider } from '../here.provider';
import type { WorldCountry } from '../../../util/world-country';
import type { HereOneResultAddressAdditionalDataType, HereOneResultAddressType, HereOneResultType } from '../interface';

export class HereLocationTransformer extends AbstractLocationTransformer<HereProvider, HereOneResultType> {
    constructor(raw: HereOneResultType) {
        super(HereProvider, raw);
    }

    async getFormattedAddress(): Promise<string | undefined> {
        return this.getLocationAddress().Label;
    }

    async getLatitude(): Promise<number> {
        return this.raw.Location.DisplayPosition.Latitude;
    }

    async getLongitude(): Promise<number> {
        return this.raw.Location.DisplayPosition.Longitude;
    }

    async getCountry(): Promise<string | undefined> {
        const country: string | undefined = this.getAdditionalDataByKey('CountryName');

        if (country) {
            return country;
        }

        const cca3: string | undefined = this.getLocationAddress().Country;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.name.common;
    }

    async getCountryCode(): Promise<string | undefined> {
        const countryCode: string | undefined = this.getAdditionalDataByKey('Country2');

        if (countryCode) {
            return countryCode;
        }

        const cca3: string | undefined = this.getLocationAddress().Country;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.cca2;
    }

    async getState(): Promise<string | undefined> {
        return this.getAdditionalDataByKey('StateName') || this.getLocationAddress().State;
    }

    async getStateCode(): Promise<string | undefined> {
        return this.getLocationAddress().State;
    }

    async getCity(): Promise<string | undefined> {
        return this.getLocationAddress().City;
    }

    async getPostalCode(): Promise<string | undefined> {
        return this.getLocationAddress().PostalCode;
    }

    async getStreetName(): Promise<string | undefined> {
        return this.getLocationAddress().Street;
    }

    async getHouseNumber(): Promise<string | undefined> {
        return this.getLocationAddress().HouseNumber;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.Location.LocationId;
    }

    private getLocationAddress(): HereOneResultAddressType {
        return this.raw.Location.Address || { AdditionalData: [] };
    }

    private getAdditionalDataByKey(key: HereOneResultAddressAdditionalDataType['key']): HereOneResultAddressAdditionalDataType['value'] | undefined {
        const data: HereOneResultAddressAdditionalDataType | undefined = this.getLocationAddress().AdditionalData!.find<HereOneResultAddressAdditionalDataType>(
            (element: HereOneResultAddressAdditionalDataType): element is HereOneResultAddressAdditionalDataType => key === element.key,
        );

        if (data) {
            return data.value;
        }
    }
}

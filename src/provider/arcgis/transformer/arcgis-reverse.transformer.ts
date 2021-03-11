import { AbstractLocationTransformer } from '../../../transformer';
import { LocationUtil } from '../../../util/location';
import type { WorldCountry } from '../../../util/world-country';
import { ArcgisProvider } from '../arcgis.provider';

export class ArcgisReverseTransformer extends AbstractLocationTransformer<ArcgisProvider> {
    constructor(raw: any) {
        super(ArcgisProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.address.LongLabel;
    }

    async getLatitude(): Promise<number> {
        return this.raw.location.y;
    }

    async getLongitude(): Promise<number> {
        return this.raw.location.x;
    }

    async getCountry(): Promise<string | undefined> {
        const cca3: string | undefined = this.raw.address.CountryCode;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.name.common;
    }

    async getCountryCode(): Promise<string | undefined> {
        const cca3: string | undefined = this.raw.address.CountryCode;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.cca2;
    }

    async getState(): Promise<string | undefined> {
        return this.raw.address.Region;
    }

    async getStateCode(): Promise<string | undefined> {
        return;
    }

    async getCity(): Promise<string | undefined> {
        return this.raw.address.City;
    }

    async getPostalCode(): Promise<string | undefined> {
        return this.raw.address.Postal;
    }

    async getStreetName(): Promise<string | undefined> {
        return this.raw.address.AddNum
            ? LocationUtil.removeHouseNumberFromStreetName(this.raw.address.Address, this.raw.address.AddNum)
            : this.raw.address.Address;
    }

    async getHouseNumber(): Promise<string | undefined> {
        return this.raw.address.AddNum;
    }

    async getPlaceId(): Promise<string | undefined> {
        return;
    }
}

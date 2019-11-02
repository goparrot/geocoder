import { AbstractLocationTransformer } from '../../../transformer';
import { LocationUtil } from '../../../util/location';
import { WorldCountry } from '../../../util/world-country';
import { ArcgisProvider } from '../arcgis.provider';

export class ArcgisLocationTransformer extends AbstractLocationTransformer<ArcgisProvider> {
    constructor(raw: any) {
        super(ArcgisProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.attributes.LongLabel;
    }

    async getLatitude(): Promise<number> {
        return this.raw.attributes.DisplayY;
    }

    async getLongitude(): Promise<number> {
        return this.raw.attributes.DisplayX;
    }

    async getCountry(): Promise<string | undefined> {
        const cca3: string | undefined = this.raw.attributes.Country;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.name.common;
    }

    async getCountryCode(): Promise<string | undefined> {
        const cca3: string | undefined = this.raw.attributes.Country;
        const worldCountry: WorldCountry | undefined = await this.getWorldCountry({ cca3 });

        return worldCountry && worldCountry.cca2;
    }

    async getState(): Promise<string | undefined> {
        return this.raw.attributes.Region;
    }

    async getStateCode(): Promise<string | undefined> {
        return this.raw.attributes.RegionAbbr;
    }

    async getCity(): Promise<string | undefined> {
        return this.raw.attributes.City;
    }

    async getPostalCode(): Promise<string | undefined> {
        return this.raw.attributes.Postal;
    }

    async getStreetName(): Promise<string | undefined> {
        return this.raw.attributes.AddNum
            ? LocationUtil.removeHouseNumberFromStreetName(this.raw.attributes.StAddr, this.raw.attributes.AddNum)
            : this.raw.attributes.StAddr;
    }

    async getHouseNumber(): Promise<string | undefined> {
        return this.raw.attributes.AddNum;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.place_id;
    }
}

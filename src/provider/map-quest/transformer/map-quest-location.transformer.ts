import { AbstractLocationTransformer } from '../../../transformer';
import { MapQuestProvider } from '../map-quest.provider';

export class MapQuestLocationTransformer extends AbstractLocationTransformer<MapQuestProvider> {
    constructor(raw: any) {
        super(MapQuestProvider, raw);
    }

    async getFormattedAddress(): Promise<string | undefined> {
        return;
    }

    async getLatitude(): Promise<number> {
        return this.raw.latLng.lat;
    }

    async getLongitude(): Promise<number> {
        return this.raw.latLng.lng;
    }

    async getCountry(): Promise<string | undefined> {
        return;
    }

    async getCountryCode(): Promise<string | undefined> {
        return this.raw.adminArea1;
    }

    async getState(): Promise<string | undefined> {
        if (this.raw.adminArea3.length !== 2) {
            return this.raw.adminArea3;
        }
    }

    async getStateCode(): Promise<string | undefined> {
        if (this.raw.adminArea3.length === 2) {
            return this.raw.adminArea3;
        }
    }

    async getCity(): Promise<string | undefined> {
        return this.raw.adminArea5;
    }

    async getPostalCode(): Promise<string | undefined> {
        return this.raw.postalCode;
    }

    async getStreetName(): Promise<string | undefined> {
        return this.raw.street;
    }

    async getHouseNumber(): Promise<string | undefined> {
        return;
    }

    async getPlaceId(): Promise<string | undefined> {
        return;
    }
}

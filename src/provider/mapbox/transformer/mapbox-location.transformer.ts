import { AbstractLocationTransformer } from '../../../transformer';
import { MapboxProvider } from '../mapbox.provider';
import type { MapboxGeocodeFeature } from '../interface';

export class MapboxLocationTransformer extends AbstractLocationTransformer<MapboxProvider, MapboxGeocodeFeature> {
    constructor(raw: MapboxGeocodeFeature) {
        super(MapboxProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.place_name;
    }

    async getLatitude(): Promise<number> {
        return this.raw.center[0];
    }

    async getLongitude(): Promise<number> {
        return this.raw.center[1];
    }

    async getCountry(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('country.'))?.text;
    }

    async getCountryCode(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('country.'))?.short_code?.toUpperCase();
    }

    async getState(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('region.'))?.text;
    }

    async getStateCode(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('region.'))?.short_code?.toUpperCase();
    }

    async getCity(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('place.'))?.text;
    }

    async getPostalCode(): Promise<string | undefined> {
        return this.raw.context?.find((obj) => obj.id.includes('postcode.'))?.text;
    }

    async getStreetName(): Promise<string | undefined> {
        return this.raw.text;
    }

    async getHouseNumber(): Promise<string | undefined> {
        return this.raw.address;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.id;
    }
}

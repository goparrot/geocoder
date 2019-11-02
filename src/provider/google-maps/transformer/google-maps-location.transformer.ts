import { AbstractLocationTransformer } from '../../../transformer';
import { GoogleMapsProvider } from '../google-maps.provider';

export class GoogleMapsLocationTransformer extends AbstractLocationTransformer<GoogleMapsProvider> {
    constructor(raw: any) {
        super(GoogleMapsProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.formatted_address;
    }

    async getLatitude(): Promise<number> {
        return this.raw.geometry.location.lat;
    }

    async getLongitude(): Promise<number> {
        return this.raw.geometry.location.lng;
    }

    async getCountry(): Promise<string> {
        return this.getAddressComponentsOfType('country').pop()!.long_name;
    }

    async getCountryCode(): Promise<string> {
        return this.getAddressComponentsOfType('country').pop()!.short_name;
    }

    async getState(): Promise<string | undefined> {
        const component: any | undefined = this.getAddressComponentsOfType('administrative_area_level_1').pop();

        if (component) {
            return component.long_name;
        }
    }

    async getStateCode(): Promise<string | undefined> {
        const component: any | undefined = this.getAddressComponentsOfType('administrative_area_level_1').pop();

        if (component) {
            return component.short_name;
        }
    }

    async getCity(): Promise<string | undefined> {
        for (const type of ['locality', 'sublocality', 'administrative_area_level_3', 'administrative_area_level_2']) {
            const component: any | undefined = this.getAddressComponentsOfType(type).pop();

            if (component) {
                return component.long_name;
            }
        }
    }

    async getPostalCode(): Promise<string | undefined> {
        const component: any | undefined = this.getAddressComponentsOfType('postal_code').pop();

        if (component) {
            return component.long_name;
        }
    }

    async getStreetName(): Promise<string | undefined> {
        const component: any | undefined = this.getAddressComponentsOfType('route').pop();

        if (component) {
            return component.long_name;
        }
    }

    async getHouseNumber(): Promise<string | undefined> {
        const component: any | undefined = this.getAddressComponentsOfType('street_number').pop();

        if (component) {
            return component.long_name;
        }
    }

    async getPlaceId(): Promise<string> {
        return this.raw.place_id;
    }

    private getAddressComponentsOfType(type: string): any[] {
        return this.raw.address_components.filter((addressComponent: any) => addressComponent.types.includes(type));
    }
}

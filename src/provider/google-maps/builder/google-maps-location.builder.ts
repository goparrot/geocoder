import { LocationBuilder } from '../../../model';
import { GoogleMapsProvider } from '../google-maps.provider';

export class GoogleMapsLocationBuilder extends LocationBuilder<GoogleMapsProvider> {
    constructor(readonly raw: any) {
        super(GoogleMapsProvider, raw);
    }

    get formattedAddress(): string {
        return this.raw.formatted_address;
    }

    get latitude(): number {
        return this.raw.geometry.location.lat;
    }

    get longitude(): number {
        return this.raw.geometry.location.lng;
    }

    get country(): string {
        return this.getAddressComponentsOfType('country').pop()!.long_name;
    }

    get countryCode(): string {
        return this.getAddressComponentsOfType('country').pop()!.short_name;
    }

    get state(): string | undefined {
        const component: any | undefined = this.getAddressComponentsOfType('administrative_area_level_1').pop();

        if (component) {
            return component.long_name;
        }
    }

    get stateCode(): string | undefined {
        const component: any | undefined = this.getAddressComponentsOfType('administrative_area_level_1').pop();

        if (component) {
            return component.short_name;
        }
    }

    get city(): string | undefined {
        for (const type of ['locality', 'sublocality', 'administrative_area_level_3', 'administrative_area_level_2']) {
            const component: any | undefined = this.getAddressComponentsOfType(type).pop();

            if (component) {
                return component.long_name;
            }
        }
    }

    get postalCode(): string | undefined {
        const component: any | undefined = this.getAddressComponentsOfType('postal_code').pop();

        if (component) {
            return component.long_name;
        }
    }

    get streetName(): string | undefined {
        const component: any | undefined = this.getAddressComponentsOfType('route').pop();

        if (component) {
            return component.long_name;
        }
    }

    get houseNumber(): string | undefined {
        const component: any | undefined = this.getAddressComponentsOfType('street_number').pop();

        if (component) {
            return component.long_name;
        }
    }

    get placeId(): string {
        return this.raw.place_id;
    }

    private getAddressComponentsOfType(type: string): any[] {
        return this.raw.address_components.filter((addressComponent: any) => addressComponent.types.includes(type));
    }
}

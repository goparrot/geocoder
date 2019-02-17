import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException } from '../exception';
import { AbstractHttpProvider, Address, GeocodeQuery, ReverseQuery } from '../model';
import { AddressBuilder } from '../model/address-builder';

export interface MapQuestProviderGeocodeParamsInterface {
    location: string | any;
    thumbMaps: boolean;
    maxResults: number;
    outFormat: string;
    country?: string;
    state?: string;
}

export interface MapQuestProviderReverseParamsInterface {
    location: string;
    thumbMaps: boolean;
    outFormat: string;
}

export class MapQuestProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient);

        if (!this.apiKey) {
            throw new InvalidCredentialsException('Invalid or missing api key.');
        }
    }

    get geocodeUrl(): string {
        return `https://www.mapquestapi.com/geocoding/v1/address?key=${this.apiKey}`;
    }

    get reverseUrl(): string {
        return `https://www.mapquestapi.com/geocoding/v1/reverse?key=${this.apiKey}`;
    }

    /**
     * @link {https://developer.mapquest.com/documentation/geocoding-api/address/post/}
     */
    async geocode(query: GeocodeQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data);
    }

    /**
     * @link {https://developer.mapquest.com/documentation/geocoding-api/reverse/get/}
     */
    async reverse(query: ReverseQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseResponse(response.data);
    }

    private async buildGeocodeQuery(query: GeocodeQuery): Promise<MapQuestProviderGeocodeParamsInterface> {
        // TODO Only for search by Address object and post request
        // const location: any = {};
        //
        // if (query.countryCode || query.country) {
        //     location.adminArea1 = query.countryCode || query.country;
        //     location.adminArea1Type = 'Country';
        // }
        //
        // if (query.stateCode || query.state) {
        //     location.adminArea3 = query.stateCode || query.state;
        //     location.adminArea3Type = 'State';
        // }
        //
        // if (query.city) {
        //     location.adminArea5 = query.city;
        //     location.adminArea5Type = 'City';
        // }
        //
        // if (query.postalCode) {
        //     location.postalCode = query.postalCode;
        // }
        //
        // if (query.address) {
        //     location.street = query.address;
        // }

        return {
            location: query.address,
            maxResults: query.limit,
            thumbMaps: false,
            outFormat: 'json',
        };
    }

    private async buildReverseQuery(query: ReverseQuery): Promise<MapQuestProviderReverseParamsInterface> {
        return {
            location: `${query.lat},${query.lon}`,
            thumbMaps: false,
            outFormat: 'json',
        };
    }

    private async parseResponse(response: any): Promise<Address[]> {
        if (!Array.isArray(response.results) || !response.results.length) {
            return [];
        }

        const locations: any[] = response.results[0].locations;
        if (!Array.isArray(locations) || !locations.length) {
            return [];
        }

        return locations.map(
            (location: any): Address => {
                const builder: AddressBuilder = new AddressBuilder(MapQuestProvider);
                builder.latitude = location.latLng.lat;
                builder.longitude = location.latLng.lng;
                builder.countryCode = location.adminArea1;
                builder.stateCode = location.adminArea3;
                builder.city = location.adminArea5;
                builder.postalCode = location.postalCode;
                builder.streetName = location.street;

                return builder.build();
            },
        );
    }
}

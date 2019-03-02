import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException, UnsupportedAccuracyException } from '../exception';
import { AbstractHttpProvider, AccuracyEnum, Address, GeocodeQuery, ReverseQuery } from '../model';
import { AddressBuilder } from '../model/address-builder';
import { sliceFrom } from '../util';

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

export enum MapQuestLocationQualityEnum {
    COUNTRY = 'COUNTRY',
    ZIP = 'ZIP',
    ZIP_EXTENDED = 'ZIP_EXTENDED',
    STATE = 'STATE',
    COUNTY = 'COUNTY',
    CITY = 'CITY',
    NEIGHBORHOOD = 'NEIGHBORHOOD',
    STREET = 'STREET',
    ADDRESS = 'ADDRESS',
    POINT = 'POINT',
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
     * @link {https://developer.mapquest.com/documentation/geocoding-api/address/get/}
     */
    async geocode(query: GeocodeQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data, query.accuracy);
    }

    /**
     * @link {https://developer.mapquest.com/documentation/geocoding-api/reverse/get/}
     */
    async reverse(query: ReverseQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseResponse(response.data, query.accuracy);
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

    private async parseResponse(response: any, accuracy?: AccuracyEnum): Promise<Address[]> {
        if (!Array.isArray(response.results) || !response.results.length) {
            return [];
        }

        const locations: any[] = response.results[0].locations.filter((location: any) => this.accuracyFilter(location, accuracy));
        if (!Array.isArray(locations) || !locations.length) {
            return [];
        }

        return locations.map(
            (location: any): Address => {
                const builder: AddressBuilder = new AddressBuilder(MapQuestProvider);
                builder.latitude = location.latLng.lat;
                builder.longitude = location.latLng.lng;
                builder.countryCode = location.adminArea1;
                if (2 === location.adminArea3.length) {
                    builder.stateCode = location.adminArea3;
                } else {
                    builder.state = location.adminArea3;
                }
                builder.city = location.adminArea5;
                builder.postalCode = location.postalCode;

                if ([MapQuestLocationQualityEnum.POINT, MapQuestLocationQualityEnum.ADDRESS].includes(location.geocodeQuality)) {
                    const words: [] = location.street.split(' ');
                    builder.houseNumber = words.shift();
                    builder.streetName = words.join(' ');
                } else {
                    builder.streetName = location.street;
                }

                return builder.build();
            },
        );
    }

    accuracyFilter(location: any, accuracy?: AccuracyEnum): boolean {
        if (!accuracy) {
            return true;
        }

        switch (accuracy) {
            case AccuracyEnum.HOUSE_NUMBER:
                return this.isQualityAppropriate(MapQuestLocationQualityEnum.POINT, location.geocodeQuality);
            case AccuracyEnum.STREET_NAME:
                return this.isQualityAppropriate(MapQuestLocationQualityEnum.STREET, location.geocodeQuality);
            case AccuracyEnum.CITY:
                return this.isQualityAppropriate(MapQuestLocationQualityEnum.CITY, location.geocodeQuality);
            case AccuracyEnum.STATE:
                return this.isQualityAppropriate(MapQuestLocationQualityEnum.STATE, location.geocodeQuality);
            case AccuracyEnum.COUNTRY:
                return this.isQualityAppropriate(MapQuestLocationQualityEnum.COUNTRY, location.geocodeQuality);
            default:
                throw new UnsupportedAccuracyException(`Unsupported "${accuracy}" accuracy.`);
        }
    }

    isQualityAppropriate(sliceToQuality: MapQuestLocationQualityEnum, locationQuality: string): boolean {
        return sliceFrom(Object.values(MapQuestLocationQualityEnum), sliceToQuality).includes(locationQuality);
    }
}

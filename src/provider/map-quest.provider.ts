import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException, UnsupportedAccuracyException } from '../exception';
import { AbstractHttpProvider, AccuracyEnum, GeocodeQuery, Location, ReverseQuery } from '../model';
import { LocationBuilder } from '../model/location-builder';
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

    get maxAccuracy(): AccuracyEnum {
        return AccuracyEnum.STREET_NAME;
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
    async geocode(query: GeocodeQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data, query.accuracy);
    }

    /**
     * @link {https://developer.mapquest.com/documentation/geocoding-api/reverse/get/}
     */
    async reverse(query: ReverseQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseResponse(response.data, query.accuracy);
    }

    private async buildGeocodeQuery(query: GeocodeQuery): Promise<MapQuestProviderGeocodeParamsInterface> {
        // TODO Only for search by Location object and post request
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

    private async parseResponse(response: any, accuracy?: AccuracyEnum): Promise<Location[]> {
        if (!Array.isArray(response.results) || !response.results.length) {
            return [];
        }

        const locations: any[] = response.results[0].locations.filter((location: any) => this.accuracyFilter(location, accuracy));
        if (!Array.isArray(locations) || !locations.length) {
            return [];
        }

        return locations.map(
            (location: any): Location => {
                const builder: LocationBuilder = new LocationBuilder(MapQuestProvider);
                builder.latitude = location.latLng.lat;
                builder.longitude = location.latLng.lng;
                builder.countryCode = location.adminArea1;
                if (2 === location.adminArea3.length) {
                    builder.stateCode = location.adminArea3;
                    builder.state = undefined;
                } else {
                    builder.stateCode = undefined;
                    builder.state = location.adminArea3;
                }
                builder.city = location.adminArea5;
                builder.streetName = location.street;
                builder.houseNumber = undefined;
                builder.postalCode = location.postalCode;

                return builder.build();
            },
        );
    }

    private accuracyFilter(location: any, accuracy?: AccuracyEnum): boolean {
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

    private isQualityAppropriate(sliceToQuality: MapQuestLocationQualityEnum, locationQuality: string): boolean {
        return sliceFrom(Object.values(MapQuestLocationQualityEnum), sliceToQuality).includes(locationQuality);
    }
}

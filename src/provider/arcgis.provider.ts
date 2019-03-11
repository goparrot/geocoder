import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../exception';
import { AbstractHttpProvider, AccuracyEnum, GeocodeQuery, Location, ReverseQuery } from '../model';
import { LocationBuilder } from '../model/location-builder';
import { LocationUtil, WorldCountry, WorldCountryUtil } from '../util';

export interface ArcgisProviderQueryInterface {
    token?: string;
    /**
     * ArcGIS Online service credits are deducted from the organization account for
     * each geocode transaction that includes the forStorage parameter with a value of true and a valid token.
     * Refer to the ArcGIS Online service credits overview page for more information on how credits are charged.
     *
     * Refer to the ArcGIS Online service credits overview page for more information on how credits are charged.
     * http://www.esri.com/SOFTWARE/ARCGIS/ARCGISONLINE/CREDITS
     *
     * To learn more about free and paid geocoding operations, see Free vs. paid operations.
     * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-free-vs-paid.htm
     */
    forStorage: boolean;
    maxLocations: number;
    locationType: 'rooftop' | 'street';
    langCode: string;
    f: 'json';
}

/**
 * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm
 */
export interface ArcgisProviderGeocodeQueryInterface extends ArcgisProviderQueryInterface {
    address: string;
    /**
     * Acceptable values include the full country name in English or the official language of the country,
     * the 2-character country code,
     * or the 3-character country code.
     * A list of supported countries and codes is available in the Geocode coverage topic.
     * https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm
     */
    countryCode?: string;
    // The largest administrative division associated with an address, typically, a state or province.
    region?: string;
    city?: string;
    // The standard postal code for an address, typically, a 3–6-digit alphanumeric code.
    postal?: string;
    matchOutOfRange: boolean;
    outFields: string;
}

export interface ArcgisProviderReverseQueryInterface extends ArcgisProviderQueryInterface {
    location: string;
    // The featureTypes parameter can be used to specify one or more match types to be returned by a reverseGeocode request
    featureTypes?: 'StreetInt' | 'DistanceMarker' | 'StreetAddress' | 'POI' | 'PointAddress' | 'Postal' | 'Locality' | string;
}

export class ArcgisProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    get maxAccuracy(): AccuracyEnum {
        return AccuracyEnum.HOUSE_NUMBER;
    }

    get geocodeUrl(): string {
        return `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates`;
    }

    get reverseUrl(): string {
        return `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode`;
    }

    /**
     * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm}
     */
    async geocode(query: GeocodeQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data);
    }

    /**
     * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm}
     */
    async reverse(query: ReverseQuery): Promise<Location[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseReverseResponse(response.data);
    }

    private async buildGeocodeQuery(query: GeocodeQuery): Promise<ArcgisProviderGeocodeQueryInterface> {
        return {
            token: this.token,
            forStorage: !!this.token,
            address: query.address,
            countryCode: query.countryCode || query.country,
            region: query.stateCode || query.state,
            city: query.city,
            postal: query.postalCode,
            maxLocations: query.limit,
            langCode: query.language,
            matchOutOfRange: false,
            locationType: 'rooftop',
            outFields: 'Addr_type,LongLabel,AddNum,StAddr,City,RegionAbbr,Region,Country,Postal,DisplayX,DisplayY',
            f: 'json',
        };
    }

    async buildReverseQuery(query: ReverseQuery): Promise<ArcgisProviderReverseQueryInterface> {
        const featureTypes: string[] = [];

        switch (query.accuracy) {
            case AccuracyEnum.HOUSE_NUMBER:
                featureTypes.push('PointAddress');
                break;
            case AccuracyEnum.STREET_NAME:
                featureTypes.push('PointAddress', 'StreetAddress');
                break;
            case AccuracyEnum.COUNTRY:
            case AccuracyEnum.STATE:
            case AccuracyEnum.CITY:
                featureTypes.push('PointAddress', 'StreetAddress', 'Locality');
                break;
            default:
                featureTypes.push('PointAddress');
        }

        return {
            token: this.token,
            forStorage: !!this.token,
            location: `${query.lon},${query.lat}`,
            featureTypes: featureTypes.join(','),
            maxLocations: query.limit,
            langCode: query.language,
            locationType: 'rooftop',
            f: 'json',
        };
    }

    private async parseResponse(response: any): Promise<Location[]> {
        this.validateResponse(response);

        if (!Array.isArray(response.candidates) || !response.candidates.length) {
            return [];
        }

        return Promise.all<Location>(
            response.candidates.map(
                async (location: any): Promise<Location> => {
                    const builder: LocationBuilder = new LocationBuilder(ArcgisProvider);
                    builder.formattedAddress = location.attributes.LongLabel;
                    builder.latitude = location.attributes.DisplayY;
                    builder.longitude = location.attributes.DisplayX;

                    if (location.attributes.Country) {
                        const country: WorldCountry | undefined = await WorldCountryUtil.find({
                            cca3: location.attributes.Country,
                        });

                        if (country) {
                            builder.country = country.name.common;
                            builder.countryCode = country.cca2;
                        }
                    }

                    builder.stateCode = location.attributes.RegionAbbr;
                    builder.state = location.attributes.Region;
                    builder.city = location.attributes.City;
                    // StAddr always includes a house number
                    builder.streetName = location.attributes.AddNum
                        ? LocationUtil.removeHouseNumberFromStreetName(location.attributes.StAddr, location.attributes.AddNum)
                        : location.attributes.StAddr;
                    builder.houseNumber = location.attributes.AddNum;
                    builder.postalCode = location.attributes.Postal;

                    return builder.build();
                },
            ),
        );
    }

    private async parseReverseResponse(response: any): Promise<Location[]> {
        this.validateResponse(response);

        if (!response.address || !response.location) {
            return [];
        }

        const builder: LocationBuilder = new LocationBuilder(ArcgisProvider);
        builder.formattedAddress = response.address.LongLabel;
        builder.latitude = response.location.y;
        builder.longitude = response.location.x;

        const cca3: string = response.address.CountryCode;
        if (cca3) {
            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                cca3,
            });

            if (country) {
                builder.country = country.name.common;
                builder.countryCode = country.cca2;
            }
        }

        builder.stateCode = undefined;
        builder.state = response.address.Region;
        builder.city = response.address.City;
        // Address always includes a house number
        builder.streetName = response.address.AddNum
            ? LocationUtil.removeHouseNumberFromStreetName(response.address.Address, response.address.AddNum)
            : response.address.Address;
        builder.houseNumber = response.address.AddNum;
        builder.postalCode = response.address.Postal;

        return [builder.build()];
    }

    /**
     * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-service-output.htm#ESRI_SECTION2_8CBF0ACE9919482384ED1EF4D4E1441D
     * @throws {GeocoderException}
     */
    private validateResponse(response: any): void {
        if (response.error) {
            const error: any = response.error;

            switch (error.code) {
                case 400:
                    throw new InvalidArgumentException(error.message, error.details);
                case 403:
                case 498:
                case 499:
                    throw new InvalidCredentialsException(error.message, error.details);
                default:
                    throw new InvalidServerResponseException(error.message, error.details);
            }
        }
    }
}

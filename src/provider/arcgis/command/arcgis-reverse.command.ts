import { AxiosInstance, AxiosResponse } from 'axios';
import { ReverseCommand } from '../../../command';
import { AccuracyEnum, Location, LocationBuilder, ReverseQuery } from '../../../model';
import { LocationUtil } from '../../../util/location';
import { WorldCountry, WorldCountryUtil } from '../../../util/world-country';
import { ArcgisProvider } from '../arcgis.provider';
import { ArcgisReverseQueryInterface } from '../interface';
import { ArcgisCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm}
 */
export class ArcgisReverseCommand extends ArcgisCommonCommandMixin(ReverseCommand)<ArcgisReverseQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    static getUrl(): string {
        return 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    }

    protected async buildQuery(query: ReverseQuery): Promise<ArcgisReverseQueryInterface> {
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

    protected async parseResponse(response: AxiosResponse): Promise<Location[]> {
        if (!response.data.address || !response.data.location) {
            return [];
        }

        const builder: LocationBuilder<ArcgisProvider> = new LocationBuilder(ArcgisProvider);
        builder.formattedAddress = response.data.address.LongLabel;
        builder.latitude = response.data.location.y;
        builder.longitude = response.data.location.x;

        const cca3: string = response.data.address.CountryCode;
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
        builder.state = response.data.address.Region;
        builder.city = response.data.address.City;
        // Address always includes a house number
        builder.streetName = response.data.address.AddNum
            ? LocationUtil.removeHouseNumberFromStreetName(response.data.address.Address, response.data.address.AddNum)
            : response.data.address.Address;
        builder.houseNumber = response.data.address.AddNum;
        builder.postalCode = response.data.address.Postal;

        return [await builder.build()];
    }
}

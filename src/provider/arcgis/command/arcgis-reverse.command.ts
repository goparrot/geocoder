import { AxiosInstance, AxiosResponse } from 'axios';
import { ReverseCommand } from '../../../command';
import { AccuracyEnum, LocationBuilder, ReverseQuery } from '../../../model';
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

    protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<ArcgisProvider>[]> {
        if (!response.data.address || !response.data.location) {
            return [];
        }

        const raw: any = response.data;

        const builder: LocationBuilder<ArcgisProvider> = new LocationBuilder(ArcgisProvider, raw);
        builder.formattedAddress = raw.address.LongLabel;
        builder.latitude = raw.location.y;
        builder.longitude = raw.location.x;

        const cca3: string = raw.address.CountryCode;
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
        builder.state = raw.address.Region;
        builder.city = raw.address.City;
        // Address always includes a house number
        builder.streetName = raw.address.AddNum ? LocationUtil.removeHouseNumberFromStreetName(raw.address.Address, raw.address.AddNum) : raw.address.Address;
        builder.houseNumber = raw.address.AddNum;
        builder.postalCode = raw.address.Postal;

        return [builder];
    }
}

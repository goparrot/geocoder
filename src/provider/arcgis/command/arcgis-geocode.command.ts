import { AxiosInstance, AxiosResponse } from 'axios';
import { GeocodeCommand } from '../../../command';
import { AccuracyEnum, GeocodeQuery, Location, LocationBuilder } from '../../../model';
import { LocationUtil } from '../../../util/location';
import { WorldCountry, WorldCountryUtil } from '../../../util/world-country';
import { ArcgisProvider } from '../arcgis.provider';
import { ArcgisGeocodeQueryInterface } from '../interface';
import { ArcgisCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm}
 */
export class ArcgisGeocodeCommand extends ArcgisCommonCommandMixin(GeocodeCommand)<ArcgisGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    static getUrl(): string {
        return 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    }

    protected async buildQuery(query: GeocodeQuery): Promise<ArcgisGeocodeQueryInterface> {
        const categories: string[] = [];

        switch (query.accuracy) {
            case AccuracyEnum.HOUSE_NUMBER:
                categories.push('Point Address');
                break;
            case AccuracyEnum.STREET_NAME:
                categories.push('Point Address', 'Street Address', 'Street Name');
                break;
            case AccuracyEnum.CITY:
                categories.push('Point Address', 'Street Address', 'Street Name', 'City');
                break;
            case AccuracyEnum.STATE:
                categories.push('Point Address', 'Street Address', 'Street Name', 'City', 'Subregion', 'Region');
                break;
            case AccuracyEnum.COUNTRY:
                categories.push('Point Address', 'Street Address', 'Street Name', 'City', 'Subregion', 'Region', 'Territory', 'Country');
                break;
        }

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
            category: categories.join(','),
            matchOutOfRange: false,
            locationType: 'rooftop',
            outFields: 'Addr_type,LongLabel,AddNum,StAddr,City,RegionAbbr,Region,Country,Postal,DisplayX,DisplayY',
            f: 'json',
        };
    }

    protected async parseResponse(response: AxiosResponse): Promise<Location[]> {
        if (!Array.isArray(response.data.candidates) || !response.data.candidates.length) {
            return [];
        }

        return Promise.all<Location>(
            response.data.candidates.map(
                async (location: any): Promise<Location> => {
                    const builder: LocationBuilder<ArcgisProvider> = new LocationBuilder(ArcgisProvider);
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
}

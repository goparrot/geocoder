import { AxiosInstance, AxiosResponse } from 'axios';
import { ReverseCommand } from '../../../command';
import { AccuracyEnum, ReverseQuery } from '../../../model';
import { ArcgisReverseQueryInterface } from '../interface';
import { ArcgisReverseTransformer } from '../transformer';
import { ArcgisCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm}
 */
export class ArcgisReverseCommand extends ArcgisCommonCommandMixin(ReverseCommand)<ArcgisReverseQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    static getUrl(): string {
        return 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode';
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

    protected async parseResponse(response: AxiosResponse): Promise<ArcgisReverseTransformer[]> {
        if (!response.data.address || !response.data.location) {
            return [];
        }

        const raw: any = response.data;

        return [new ArcgisReverseTransformer(raw)];
    }
}

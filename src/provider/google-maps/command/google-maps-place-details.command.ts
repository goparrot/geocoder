import { AxiosInstance, AxiosResponse } from 'axios';
import { PlaceDetailsCommand } from '../../../command';
import { LocationBuilder, PlaceDetailsQuery } from '../../../model';
import { GoogleMapsProvider } from '../google-maps.provider';
import { GoogleMapsPlaceDatailsQueryInterface } from '../interface';
import { GoogleMapsLocationCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/places/web-service/details}
 */
export class GoogleMapsPlaceDetailsCommand extends GoogleMapsLocationCommandMixin(PlaceDetailsCommand)<GoogleMapsPlaceDatailsQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/place/details/json';
    }

    protected async buildQuery(query: PlaceDetailsQuery): Promise<GoogleMapsPlaceDatailsQueryInterface> {
        const providerQuery: GoogleMapsPlaceDatailsQueryInterface = {
            key: this.apiKey,
            placeid: query.placeId,
            language: query.language,
            sensor: false,
        };

        if (query.countryCode) {
            providerQuery.region = `.${query.countryCode.toLowerCase()}`;
        }

        return providerQuery;
    }

    protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<GoogleMapsProvider>[]> {
        if (!response.data.result) {
            return [];
        }

        return [await this.parseOneResult(response.data.result)];
    }
}

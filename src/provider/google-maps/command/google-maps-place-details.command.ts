import { AxiosInstance, AxiosResponse } from 'axios';
import { PlaceDetailsCommand } from '../../../command';
import { PlaceDetailsQuery } from '../../../model';
import { GoogleMapsPlaceDetailsQueryInterface } from '../interface';
import { GoogleMapsLocationTransformer } from '../transformer';
import { GoogleMapsLocationCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/places/web-service/details}
 */
export class GoogleMapsPlaceDetailsCommand extends GoogleMapsLocationCommandMixin(PlaceDetailsCommand)<GoogleMapsPlaceDetailsQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/place/details/json';
    }

    protected async buildQuery(query: PlaceDetailsQuery): Promise<GoogleMapsPlaceDetailsQueryInterface> {
        const providerQuery: GoogleMapsPlaceDetailsQueryInterface = {
            key: this.apiKey,
            placeid: query.placeId,
            language: query.language,
            sensor: false,
            /**
             * @see interface
             * used basic fields
             */
            fields: 'address_component,formatted_address,geometry,place_id,type',
        };

        if (query.countryCode) {
            providerQuery.region = `.${query.countryCode.toLowerCase()}`;
        }

        return providerQuery;
    }

    protected async parseResponse(response: AxiosResponse): Promise<GoogleMapsLocationTransformer[]> {
        if (!response.data.result) {
            return [];
        }

        return [await this.parseOneResult(response.data.result)];
    }
}

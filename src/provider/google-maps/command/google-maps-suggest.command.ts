import type { AxiosInstance, AxiosResponse } from 'axios';
import { GoogleMapsSuggestionTransformer } from '../transformer';
import { AccuracyEnum } from '../../../model';
import { SuggestCommand } from '../../../command';
import type { SuggestQueryInterface } from '../../../interface';
import type { SuggestQuery } from '../../../model';
import type { AbstractSuggestionTransformer } from '../../../transformer';
import type { GoogleMapsProvider } from '../google-maps.provider';
import type { GoogleMapsSuggestQueryInterface } from '../interface';
import { GoogleMapsCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests}
 */
export class GoogleMapsSuggestCommand extends GoogleMapsCommonCommandMixin(SuggestCommand)<GoogleMapsSuggestQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    }

    protected async buildQuery(query: SuggestQuery): Promise<GoogleMapsSuggestQueryInterface> {
        /**
         * @link {https://developers.google.com/places/web-service/autocomplete#place_types}
         */
        const components = new Map<string, string>();

        const country = query.countryCode || query.country;
        if (country) {
            components.set('country', country);
        }

        const providerQuery: GoogleMapsSuggestQueryInterface = {
            key: this.apiKey,
            input: query.address,
            components: [...components].map<string>(([key, value]) => `${key}:${value}`).join('|'),
            language: query.language,
            types: this.getRequestTypeByAccuracy(query.accuracy),
            sensor: false,
        };

        if (query.countryCode) {
            providerQuery.region = `.${query.countryCode.toLowerCase()}`;
        }

        if (query.lat && query.lon) {
            providerQuery.location = `${query.lat},${query.lon}`;

            if (query.radius) {
                providerQuery.radius = query.radius;
                providerQuery.strictbounds = true;
            }
        }

        return providerQuery;
    }

    protected async parseResponse(response: AxiosResponse, query: SuggestQueryInterface): Promise<AbstractSuggestionTransformer<GoogleMapsProvider>[]> {
        if (!Array.isArray(response.data.predictions) || !response.data.predictions.length) {
            return [];
        }

        let results: any[] = response.data.predictions;

        results = results.filter((raw: any) => this.filterByAccuracy(raw, query.accuracy));
        if (!results.length) {
            return [];
        }

        return Promise.all<AbstractSuggestionTransformer<GoogleMapsProvider>>(
            results.map(async (raw: any): Promise<AbstractSuggestionTransformer<GoogleMapsProvider>> => new GoogleMapsSuggestionTransformer(raw)),
        );
    }

    private getRequestTypeByAccuracy(accuracy?: AccuracyEnum): GoogleMapsSuggestQueryInterface['types'] {
        switch (accuracy) {
            case AccuracyEnum.HOUSE_NUMBER:
                return 'address';
            case AccuracyEnum.STREET_NAME:
                return 'geocode';
            case AccuracyEnum.CITY:
                return '(cities)';
            case AccuracyEnum.STATE:
            case AccuracyEnum.COUNTRY:
                return '(regions)';
            default:
                return '';
        }
    }

    /**
     * Mapping between google location types and our
     */
    private filterByAccuracy({ types }: { types: string[] }, accuracy?: AccuracyEnum): boolean {
        if (!accuracy) {
            return true;
        }

        switch (accuracy) {
            case AccuracyEnum.HOUSE_NUMBER:
                return types.includes('street_address') || types.includes('premise');
            case AccuracyEnum.STREET_NAME:
                return types.includes('route');
            case AccuracyEnum.CITY:
                // @todo check sublocality ?
                return types.includes('locality');
            case AccuracyEnum.STATE:
                return types.includes('administrative_area_level_1');
            case AccuracyEnum.COUNTRY:
                return types.includes('country');
        }

        return false;
    }
}

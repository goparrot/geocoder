import { AxiosInstance, AxiosResponse } from 'axios';
import { SuggestCommand } from '../../../command';
import { SuggestionBuilder, SuggestQuery } from '../../../model';
import { GoogleMapsProvider } from '../google-maps.provider';
import { GoogleMapsSuggestQueryInterface } from '../interface';
import { GoogleMapsCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests}
 */
export class GoogleMapsSuggestCommand extends GoogleMapsCommonCommandMixin(SuggestCommand)<GoogleMapsSuggestQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        // @ts-ignore
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    }

    protected async buildQuery(query: SuggestQuery): Promise<GoogleMapsSuggestQueryInterface> {
        /**
         * @link {https://developers.google.com/places/web-service/autocomplete#place_types}
         */
        const components: Map<string, string> = new Map();

        const country: string | undefined = query.countryCode || query.country;
        if (country) {
            components.set('country', country);
        }

        const providerQuery: GoogleMapsSuggestQueryInterface = {
            key: this.apiKey,
            input: query.address,
            components: [...components].map<string>((value: [string, string]) => `${value[0]}:${value[1]}`).join('|'),
            language: query.language,
            types: 'address',
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

    protected async parseResponse(response: AxiosResponse): Promise<SuggestionBuilder<GoogleMapsProvider>[]> {
        if (!Array.isArray(response.data.predictions) || !response.data.predictions.length) {
            return [];
        }

        return Promise.all<SuggestionBuilder<GoogleMapsProvider>>(
            response.data.predictions.map(
                async (raw: any): Promise<SuggestionBuilder<GoogleMapsProvider>> => {
                    const builder: SuggestionBuilder<GoogleMapsProvider> = new SuggestionBuilder(GoogleMapsProvider, raw);
                    builder.formattedAddress = raw.description;
                    builder.placeId = raw.place_id;

                    return builder;
                },
            ),
        );
    }
}

import type { AxiosInstance, AxiosResponse } from 'axios';
import { SuggestCommand } from '../../../command';
import type { SuggestQuery } from '../../../model';
import { AccuracyEnum } from '../../../model';
import type { AbstractSuggestionTransformer } from '../../../transformer';
import type { WorldCountry } from '../../../util/world-country';
import { WorldCountryUtil } from '../../../util/world-country';
import type { ArcgisProvider } from '../arcgis.provider';
import type { ArcgisSuggestionInterface, ArcgisSuggestQueryInterface, ArcgisSuggestResponseInterface } from '../interface';
import { ArcgisSuggestionTransformer } from '../transformer';
import { ArcgisCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm}
 */
export class ArcgisSuggestCommand extends ArcgisCommonCommandMixin(SuggestCommand)<ArcgisSuggestQueryInterface, ArcgisSuggestResponseInterface> {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    static getUrl(): string {
        return 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
    }

    protected async buildQuery(query: SuggestQuery): Promise<ArcgisSuggestQueryInterface> {
        const categories: string[] = this.getCategoriesByAccuracy(query.accuracy);

        if (!query.countryCode && query.country) {
            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                name: query.country,
            });

            if (country) {
                query.countryCode = country.cca2;
            }
        }

        const providerQuery: ArcgisSuggestQueryInterface = {
            token: this.token,
            forStorage: !!this.token,
            text: query.address,
            countryCode: query.countryCode,
            maxSuggestions: query.limit,
            langCode: query.language,
            category: categories.join(','),
            isCollection: false,
            f: 'json',
        };

        if (query.lat && query.lon) {
            providerQuery.location = `${query.lon},${query.lat}`;
        }

        return providerQuery;
    }

    protected async parseResponse(
        response: AxiosResponse<ArcgisSuggestResponseInterface>,
    ): Promise<AbstractSuggestionTransformer<ArcgisProvider, ArcgisSuggestionInterface>[]> {
        if (!Array.isArray(response.data.suggestions)) {
            return [];
        }

        return Promise.all<AbstractSuggestionTransformer<ArcgisProvider, ArcgisSuggestionInterface>>(
            response.data.suggestions.map(
                async (suggestion: ArcgisSuggestionInterface): Promise<AbstractSuggestionTransformer<ArcgisProvider, ArcgisSuggestionInterface>> =>
                    new ArcgisSuggestionTransformer(suggestion),
            ),
        );
    }

    private getCategoriesByAccuracy(accuracy?: AccuracyEnum): string[] {
        const categories: string[] = [];

        if (!accuracy) {
            return categories;
        }

        switch (accuracy) {
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

        return categories;
    }
}

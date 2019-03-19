import { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import { GeocodeQuery } from '../../../model';
import { WorldCountry, WorldCountryUtil } from '../../../util/world-country';
import { HereGeocodeQueryInterface } from '../interface';
import { HereCommonCommandMixin } from './mixin';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-geocode.html}
 */
export class HereGeocodeCommand extends HereCommonCommandMixin(GeocodeCommand)<HereGeocodeQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly appId: string, private readonly appCode: string) {
        // @ts-ignore
        super(httpClient, appId, appCode);
    }

    /**
     * @link {https://developer.here.com/documentation/geocoder/common/request-cit-environment-rest.html}
     */
    static getUrl(): string {
        return 'https://geocoder.api.here.com/6.2/geocode.json';
    }

    protected async buildQuery(query: GeocodeQuery): Promise<HereGeocodeQueryInterface> {
        const params: HereGeocodeQueryInterface = {
            app_id: this.appId,
            app_code: this.appCode,
            language: query.language,
            searchtext: query.address,
            maxresults: query.limit,
            gen: 9,
            additionaldata: 'Country2,true;NormalizeNames,true',
        };

        if (query.postalCode) {
            params.postalcode = query.postalCode;
        }

        if (query.countryCode || query.country) {
            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                name: query.country,
                cca2: query.countryCode,
            });

            /**
             * To avoid ambiguity we recommend to specify the country with the 3-letter ISO code and not with the spelled out country name.
             * With names there is a higher risk of misspells and also not all language translations for all countries are supported.
             */
            params.country = country ? country.cca3 : query.countryCode || query.country;

            if (query.stateCode || query.state) {
                /** Specify state using full or abbreviated notation. */
                params.state = query.stateCode || query.state;
            }

            if (query.city) {
                params.city = query.city;
            }
        }

        return params;
    }
}

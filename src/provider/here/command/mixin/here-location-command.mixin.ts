import { WorldCountryUtil } from '../../../../util/world-country';
import { HereCommonCommandMixin } from './here-common-command.mixin';
import type { AbstractCommand } from '../../../../command';
import type { GeocodeQuery } from '../../../../model';
import type { Constructor } from '../../../../types';
import type { WorldCountry } from '../../../../util/world-country';
import type { HereGeocodeQueryInterface } from '../../interface';

export function HereLocationCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class HereLocationCommand extends HereCommonCommandMixin(Base) {
        protected readonly appId: string;
        protected readonly appCode: string;

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

            if (query.lat && query.lon && query.radius) {
                params.prox = `${query.lat},${query.lon},${query.radius}`;
            }

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

    return HereLocationCommand;
}

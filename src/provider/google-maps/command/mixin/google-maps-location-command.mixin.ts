import { GoogleMapsLocationTransformer } from '../../transformer';
import { GoogleMapsCommonCommandMixin } from './google-maps-common-command.mixin';
import type { AxiosResponse } from 'axios';
import type { AbstractCommand } from '../../../../command';
import type { AbstractLocationTransformer } from '../../../../transformer';
import type { Constructor } from '../../../../types';
import type { GoogleMapsProvider } from '../../google-maps.provider';

export function GoogleMapsLocationCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class GoogleMapsLocationCommand extends GoogleMapsCommonCommandMixin(Base) {
        protected async parseResponse(response: AxiosResponse): Promise<AbstractLocationTransformer<GoogleMapsProvider>[]> {
            if (!Array.isArray(response.data.results) || !response.data.results.length) {
                return [];
            }

            return Promise.all<AbstractLocationTransformer<GoogleMapsProvider>>(
                response.data.results.map(async (raw: any): Promise<AbstractLocationTransformer<GoogleMapsProvider>> => this.parseOneResult(raw)),
            );
        }

        protected async parseOneResult(raw: any): Promise<AbstractLocationTransformer<GoogleMapsProvider>> {
            return new GoogleMapsLocationTransformer(raw);
        }
    }

    return GoogleMapsLocationCommand;
}

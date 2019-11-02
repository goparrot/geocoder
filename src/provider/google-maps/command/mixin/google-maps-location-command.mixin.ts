import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { LocationBuilder } from '../../../../model';
import { Constructor } from '../../../../types';
import { GoogleMapsLocationBuilder } from '../../builder';
import { GoogleMapsProvider } from '../../google-maps.provider';
import { GoogleMapsCommonCommandMixin } from './google-maps-common-command.mixin';

export function GoogleMapsLocationCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class GoogleMapsLocationCommand extends GoogleMapsCommonCommandMixin(Base) {
        protected async parseResponse(response: AxiosResponse): Promise<LocationBuilder<GoogleMapsProvider>[]> {
            if (!Array.isArray(response.data.results) || !response.data.results.length) {
                return [];
            }

            return Promise.all<LocationBuilder<GoogleMapsProvider>>(
                response.data.results.map(async (raw: any): Promise<LocationBuilder<GoogleMapsProvider>> => new GoogleMapsLocationBuilder(raw)),
            );
        }
    }

    return GoogleMapsLocationCommand;
}

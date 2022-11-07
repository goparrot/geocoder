import type { AxiosResponse } from 'axios';
import type { AbstractCommand } from '../../../../command';
import type { Constructor } from '../../../../types';
import type { MapboxGeocodeResponse, MapboxReverseQueryInterface } from '../../interface';
import { MapboxGeocodeCommandMixin } from './mapbox-geocode-command.mixin';

export function MapboxReverseCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class MapboxReverseCommand extends MapboxGeocodeCommandMixin(Base) {
        protected async getResponse(params: MapboxReverseQueryInterface): Promise<AxiosResponse<MapboxGeocodeResponse>> {
            return this.httpClient.get<MapboxGeocodeResponse>(this.constructor.getUrl(params.mode, params.lon, params.lat), {
                params,
            });
        }
    }

    return MapboxReverseCommand;
}

import type { AxiosResponse } from 'axios';
import { MapboxLocationTransformer } from '../../transformer';
import type { AbstractCommand } from '../../../../command';
import type { Constructor } from '../../../../types';
import type { MapboxGeocodeFeature, MapboxGeocodeQueryInterface, MapboxGeocodeResponse } from '../../interface';
import { MapboxCommonCommandMixin } from './mapbox-common-command.mixin';

export function MapboxGeocodeCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class MapboxGeocodeCommand extends MapboxCommonCommandMixin(Base) {
        protected async getResponse(params: MapboxGeocodeQueryInterface): Promise<AxiosResponse<MapboxGeocodeResponse>> {
            return this.httpClient.get<MapboxGeocodeResponse>(this.constructor.getUrl(params.mode, params.query), {
                params,
            });
        }

        protected async validateResponse(_response: AxiosResponse<MapboxGeocodeResponse>): Promise<void> {
            // if (response.data.error) {
            //     const error: any = response.data.error;
            //
            //     switch (error.code) {
            //         case 400:
            //             throw new InvalidArgumentException(error.message, response);
            //         case 401:
            //         case 403:
            //             throw new InvalidCredentialsException(error.message, response);
            //         case 404:
            //             throw new NotFoundException(error.message, response);
            //         case 422:
            //             throw new InvalidArgumentException(error.message, response);
            //         default:
            //             throw new InvalidServerResponseException(error.message, response);
            //     }
            // }
        }

        protected async parseResponse(response: AxiosResponse<MapboxGeocodeResponse>): Promise<MapboxLocationTransformer[]> {
            if (!Array.isArray(response.data.features) || !response.data.features.length) {
                return [];
            }

            return Promise.all<MapboxLocationTransformer>(
                response.data.features.map(async (raw: MapboxGeocodeFeature): Promise<MapboxLocationTransformer> => new MapboxLocationTransformer(raw)),
            );
        }
    }

    return MapboxGeocodeCommand;
}

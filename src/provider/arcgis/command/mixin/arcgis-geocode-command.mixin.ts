import type { AxiosResponse } from 'axios';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../../../../exception';
import { ArcgisLocationTransformer } from '../../transformer';
import type { AbstractCommand } from '../../../../command';
import type { Constructor } from '../../../../types';
import { ArcgisCommonCommandMixin } from './arcgis-common-command.mixin';

export function ArcgisGeocodeCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class ArcgisGeocodeCommand extends ArcgisCommonCommandMixin(Base) {
        protected async validateResponse(response: AxiosResponse): Promise<void> {
            if (response.data.error) {
                const error: any = response.data.error;

                switch (error.code) {
                    case 400:
                        throw new InvalidArgumentException(error.message, response);
                    case 403:
                    case 498:
                    case 499:
                        throw new InvalidCredentialsException(error.message, response);
                    default:
                        throw new InvalidServerResponseException(error.message, response);
                }
            }
        }

        protected async parseResponse(response: AxiosResponse): Promise<ArcgisLocationTransformer[]> {
            if (!Array.isArray(response.data.candidates) || !response.data.candidates.length) {
                return [];
            }

            return Promise.all<ArcgisLocationTransformer>(
                response.data.candidates.map(async (raw: any): Promise<ArcgisLocationTransformer> => new ArcgisLocationTransformer(raw)),
            );
        }
    }

    return ArcgisGeocodeCommand;
}

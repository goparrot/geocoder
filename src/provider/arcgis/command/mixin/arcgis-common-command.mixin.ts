import { AxiosResponse } from 'axios';
import { AbstractCommand } from '../../../../command';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../../../../exception';
import { AccuracyEnum } from '../../../../model';
import { Constructor } from '../../../../types';

export function ArcgisCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    return class extends Base {
        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

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
    };
}

import { AxiosInstance, AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import { AbstractCommand } from '../../../../command';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../../exception';
import { AccuracyEnum } from '../../../../model';
import { Constructor } from '../../../../types';

export function GoogleMapsCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class GoogleMapsCommonCommand extends Base {
        protected readonly apiKey: any;

        protected constructor(...args: any[]) {
            const [httpClient, apiKey]: [AxiosInstance, string] = args as any;

            super(httpClient);

            this.apiKey = apiKey;

            if (!this.apiKey) {
                throw new InvalidCredentialsException('Invalid or missing api key.');
            }
        }

        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

        /**
         * @link {https://developers.google.com/maps/documentation/geocoding/intro#StatusCodes}
         */
        protected async validateResponse(response: AxiosResponse): Promise<void> {
            if (isEmpty(response.data)) {
                return;
            }

            if ('OK' === response.data.status) {
                return;
            }

            if ('REQUEST_DENIED' === response.data.status && 'The provided API key is invalid.' === response.data.error_message) {
                throw new InvalidCredentialsException('API key is invalid', response);
            } else if ('REQUEST_DENIED' === response.data.status) {
                throw new InvalidServerResponseException('API key is invalid', response);
            } else if ('OVER_QUERY_LIMIT' === response.data.status) {
                throw new QuotaExceededException('Quota exceeded', response);
            } else if ('OVER_DAILY_LIMIT' === response.data.status) {
                /**
                 * @link {https://developers.google.com/maps/faq#over-limit-key-error}
                 */
                throw new QuotaExceededException('Daily quota exceeded', response);
            } else if ('INVALID_REQUEST' === response.data.status) {
                throw new InvalidArgumentException('Invalid request', response);
            } else if ('UNKNOWN_ERROR' === response.data.status) {
                throw new InvalidServerResponseException('Unknown error', response);
            } else if ('ZERO_RESULTS' === response.data.status) {
                return;
            }

            throw new InvalidServerResponseException(`Unknown status "${response.data.status}" error`, response);
        }
    }

    return GoogleMapsCommonCommand;
}

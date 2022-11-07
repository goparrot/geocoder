import type { AxiosResponse } from 'axios';
import type { AbstractCommand } from '../../../../command';
import type { Constructor } from '../../../../types';
import type { MapboxGeocodeQueryType, MapboxGeocodeResponse } from '../../interface';
import { AccuracyEnum } from '../../../../model';

export function MapboxCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    return class extends Base {
        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

        protected convertAccuracyToTypes(accuracy?: AccuracyEnum): MapboxGeocodeQueryType[] {
            const types: MapboxGeocodeQueryType[] = [];

            switch (accuracy) {
                case AccuracyEnum.HOUSE_NUMBER:
                    types.push('address');
                    break;
                case AccuracyEnum.STREET_NAME:
                    types.push('address');
                    break;
                case AccuracyEnum.CITY:
                    types.push('place', 'district', 'locality', 'neighborhood');
                    break;
                case AccuracyEnum.STATE:
                    types.push('region');
                    break;
                case AccuracyEnum.COUNTRY:
                    types.push('country');
                    break;
            }

            return types;
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
    };
}

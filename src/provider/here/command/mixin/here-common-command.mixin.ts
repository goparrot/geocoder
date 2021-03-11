import type { AxiosResponse } from 'axios';
import type { AbstractCommand } from '../../../../command';
import { InvalidCredentialsException } from '../../../../exception';
import type { Query } from '../../../../model';
import { AccuracyEnum } from '../../../../model';
import type { Constructor } from '../../../../types';
import type { HereOneResultType, HereResponseType } from '../../interface';
import { HereLocationTransformer } from '../../transformer';
import { filterByAccuracy } from '../../util';

export function HereCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class HereCommonCommand extends Base {
        protected readonly appId: string;
        protected readonly appCode: string;

        protected constructor(...args: any[]) {
            super(args[0]);

            this.appId = args[1];
            this.appCode = args[2];

            if (!this.appId || !this.appCode) {
                throw new InvalidCredentialsException('Invalid or missing api key.');
            }
        }

        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.HOUSE_NUMBER;
        }

        protected async validateResponse(_response: AxiosResponse<HereResponseType>): Promise<void> {
            //
        }

        protected async parseResponse(response: AxiosResponse<HereResponseType>, query: Query): Promise<HereLocationTransformer[]> {
            if (!response.data.Response || !Array.isArray(response.data.Response.View) || !response.data.Response.View[0]) {
                return [];
            }

            let results: HereOneResultType[] = response.data.Response.View[0].Result;

            results = results.filter((raw: HereOneResultType) => filterByAccuracy(raw, query.accuracy));
            if (!results.length) {
                return [];
            }

            return Promise.all<HereLocationTransformer>(
                results.map(async (raw: HereOneResultType): Promise<HereLocationTransformer> => new HereLocationTransformer(raw)),
            );
        }
    }

    return HereCommonCommand;
}

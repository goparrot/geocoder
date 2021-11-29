import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import countryStates from '../../data/country-states/country-states.json';
import { WorldCountryState } from './world-country-state';
import { WorldCountryStateQuery } from './world-country-state-query';
import type { WorldCountryStateQueryInterface } from './world-country-state-query.interface';
import type { WorldCountryStateInterface } from './world-country-state.interface';

export class WorldCountryStateUtil {
    /**
     * Returns result only if all fields matched
     */
    private static match(state: WorldCountryState, filters: WorldCountryStateQuery): boolean {
        if (
            state.countryCode.toLowerCase() === filters.countryCode.toLowerCase() &&
            ((filters.stateCode && state.stateCode.toLowerCase() === filters.stateCode.toLowerCase()) ||
                (filters.name && state.name.toLowerCase() === filters.name.toLowerCase()))
        ) {
            return true;
        }

        return false;
    }

    static async find(_query: WorldCountryStateQueryInterface): Promise<WorldCountryState | undefined> {
        const query: WorldCountryStateQuery = plainToInstance<WorldCountryStateQuery, WorldCountryStateQueryInterface>(WorldCountryStateQuery, _query);
        const keys: Array<keyof WorldCountryStateQuery> = Object.keys(query) as unknown as Array<keyof WorldCountryStateQuery>;

        // clear undefined/empty values
        for (const key of keys) {
            if (!query[key]) {
                delete query[key];
            }
        }

        try {
            await validateOrReject(query, {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: { target: false, value: false },
            });
        } catch (err: any) {
            return;
        }

        const stateData: WorldCountryStateInterface | undefined = (countryStates as WorldCountryStateInterface[]).find(
            (plainState: WorldCountryStateInterface) => {
                const state: WorldCountryState = plainToInstance<WorldCountryState, WorldCountryStateInterface>(WorldCountryState, plainState);

                return WorldCountryStateUtil.match(state, query);
            },
        );

        if (!stateData) {
            return;
        }

        return plainToInstance<WorldCountryState, WorldCountryStateInterface>(WorldCountryState, stateData);
    }
}

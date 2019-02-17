import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import countryStates from '../../data/country-states/country-states.json';
import { ValidationException } from '../../exception';
import { WorldCountryState } from './world-country-state';
import { WorldCountryStateQuery } from './world-country-state-query';
import { WorldCountryStateQueryInterface } from './world-country-state-query.interface';
import { WorldCountryStateInterface } from './world-country-state.interface';

export class WorldCountryStateUtil {
    private static match(state: WorldCountryState, filters: WorldCountryStateQuery): boolean {
        for (const key of Object.keys(filters)) {
            const searchValue: any = filters[key].toLowerCase();

            if (state[key].toLowerCase() !== searchValue) {
                return false;
            }
        }

        return true;
    }

    /**
     * @throws {ValidationException}
     */
    static async find(_query: WorldCountryStateQueryInterface): Promise<WorldCountryState | undefined> {
        const query: WorldCountryStateQuery = plainToClass<WorldCountryStateQuery, WorldCountryStateQueryInterface>(WorldCountryStateQuery, _query);

        // clear undefined/empty values
        for (const key of Object.keys(query)) {
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
        } catch (err) {
            throw new ValidationException(err);
        }

        const stateData: WorldCountryStateInterface | undefined = (countryStates as WorldCountryStateInterface[]).find(
            (plainState: WorldCountryStateInterface) => {
                const state: WorldCountryState = plainToClass<WorldCountryState, WorldCountryStateInterface>(WorldCountryState, plainState);
                return WorldCountryStateUtil.match(state, query);
            },
        );

        if (!stateData) {
            return;
        }

        return plainToClass<WorldCountryState, WorldCountryStateInterface>(WorldCountryState, stateData);
    }
}

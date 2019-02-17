import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import countries from 'world-countries/dist/countries-unescaped.json';
import { ValidationException } from '../../exception';
import { WorldCountry } from './world-country';
import { WorldCountryQuery } from './world-country-query';
import { WorldCountryQueryInterface } from './world-country-query.interface';
import { WorldCountryInterface } from './world-country.interface';

export class WorldCountryUtil {
    private static match(country: WorldCountry, filters: WorldCountryQuery): boolean {
        for (const key of Object.keys(filters)) {
            const searchValue: any = filters[key].toLowerCase();

            if ('name' === key) {
                // TODO add search by `country.name.native` property
                if (country.name.common.toLowerCase() === searchValue || country.name.official.toLowerCase() === searchValue) {
                    return true;
                }
            } else if (country[key].toLowerCase() === searchValue) {
                return true;
            }
        }

        return false;
    }

    /**
     * @throws {ValidationException}
     */
    static async find(_query: WorldCountryQueryInterface): Promise<WorldCountry | undefined> {
        const query: WorldCountryQuery = plainToClass<WorldCountryQuery, WorldCountryQueryInterface>(WorldCountryQuery, _query);

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

        const countryData: WorldCountryInterface | undefined = (countries as WorldCountryInterface[]).find((plainCountry: WorldCountryInterface) => {
            const country: WorldCountry = plainToClass<WorldCountry, WorldCountryInterface>(WorldCountry, plainCountry);

            return WorldCountryUtil.match(country, query);
        });

        if (!countryData) {
            return;
        }

        return plainToClass<WorldCountry, WorldCountryInterface>(WorldCountry, countryData);
    }
}

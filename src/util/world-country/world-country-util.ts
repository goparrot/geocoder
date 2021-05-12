import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { Countries, Country } from 'world-countries';
import countries from 'world-countries/dist/countries-unescaped.json';
import { WorldCountry } from './world-country';
import { WorldCountryQuery } from './world-country-query';
import type { WorldCountryQueryInterface } from './world-country-query.interface';

export class WorldCountryUtil {
    /**
     * Returns the result if at least one of the fields matches
     */
    private static match(country: WorldCountry, filters: WorldCountryQuery): boolean {
        const keys: Array<keyof WorldCountryQuery> = Object.keys(filters) as unknown as Array<keyof WorldCountryQuery>;

        for (const key of keys) {
            const searchValue: unknown = filters[key]?.toString().toLowerCase();

            if ('name' === key) {
                // TODO add search by `country.name.native` property
                if (country.name.common.toLowerCase() === searchValue || country.name.official.toLowerCase() === searchValue) {
                    return true;
                }
            } else if (country[key]?.toString().toLowerCase() === searchValue) {
                return true;
            }
        }

        return false;
    }

    static async find(_query: WorldCountryQueryInterface): Promise<WorldCountry | undefined> {
        const query: WorldCountryQuery = plainToClass<WorldCountryQuery, WorldCountryQueryInterface>(WorldCountryQuery, _query);
        const keys: Array<keyof WorldCountryQueryInterface> = Object.keys(query) as unknown as Array<keyof WorldCountryQueryInterface>;

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
        } catch (err) {
            return;
        }

        const countryData: Country | undefined = (countries as unknown as Countries).find((plainCountry: Country) => {
            const country: WorldCountry = plainToClass<WorldCountry, Country>(WorldCountry, plainCountry);

            return WorldCountryUtil.match(country, query);
        });

        if (!countryData) {
            return;
        }

        return plainToClass<WorldCountry, Country>(WorldCountry, countryData);
    }
}

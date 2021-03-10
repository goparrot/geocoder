import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Countries, Country } from 'world-countries';
import countries from 'world-countries/dist/countries-unescaped.json';
import { WorldCountry } from './world-country';
import { WorldCountryQuery } from './world-country-query';
import { WorldCountryQueryInterface } from './world-country-query.interface';

export class WorldCountryUtil {
    /**
     * Returns the result if at least one of the fields matches
     */
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
            return;
        }

        const countryData: Country | undefined = ((countries as unknown) as Countries).find((plainCountry: Country) => {
            const country: WorldCountry = plainToClass<WorldCountry, Country>(WorldCountry, plainCountry);

            return WorldCountryUtil.match(country, query);
        });

        if (!countryData) {
            return;
        }

        return plainToClass<WorldCountry, Country>(WorldCountry, countryData);
    }
}

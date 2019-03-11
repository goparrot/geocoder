import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { Query } from '../../../src/model';

export const geocodeQueryFixture: Readonly<GeocodeQueryInterface> = Object.freeze({
    address: '1158 E 89th St',
    countryCode: 'US',
    postalCode: '60619',
    state: 'Illinois',
    stateCode: 'IL',
    city: 'Chicago',
    language: 'en',
    limit: Query.DEFAULT_RESULT_LIMIT,
    fillMissingQueryProperties: true,
});

export const reverseQueryFixture: Readonly<ReverseQueryInterface> = Object.freeze({
    lat: 40.74185,
    lon: -74,
    limit: Query.DEFAULT_RESULT_LIMIT,
    language: Query.DEFAULT_RESULT_LANGUAGE,
});

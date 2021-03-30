import type {
    DistanceQueryInterface,
    GeocodeQueryInterface,
    PlaceDetailsQueryInterface,
    ReverseQueryInterface,
    SuggestQueryInterface,
} from '../../../src/interface';
import { Query, TravelModeEnum } from '../../../src/model';

export const geocodeQueryFixture: Readonly<GeocodeQueryInterface> = Object.freeze<GeocodeQueryInterface>({
    address: '1158 E 89th St',
    countryCode: 'US',
    postalCode: '60619',
    state: 'Illinois',
    stateCode: 'IL',
    city: 'Chicago',
    lat: 41.7340186,
    lon: -87.5960762,
    radius: 25000,
    language: 'en',
    limit: 3,
    fillMissingQueryProperties: true,
    withRaw: true,
});

export const geocodeQueryFixtureForAustralia: Readonly<GeocodeQueryInterface> = Object.freeze<GeocodeQueryInterface>({
    address: '2 Balaka Pl',
    countryCode: 'AU',
    postalCode: '3083',
    state: 'Victoria',
    stateCode: 'VIC',
    city: 'Bundoora',
    lat: -37.70083069999999,
    lon: 145.0655546,
    radius: 25000,
    language: 'en',
    limit: 3,
    fillMissingQueryProperties: true,
    withRaw: true,
});

export const geocodeQueryFixtureForCountryWithoutStateCode: Readonly<GeocodeQueryInterface> = Object.freeze<GeocodeQueryInterface>({
    address: 'Strada Lacului 44',
    countryCode: 'MD',
    postalCode: '2009',
    state: 'Chișinău',
    stateCode: 'Chișinău',
    city: 'Chișinău',
    lat: 47.0099488,
    lon: 28.8251969,
    radius: 25000,
    language: 'en',
    limit: 3,
    fillMissingQueryProperties: true,
    withRaw: true,
});

export const reverseQueryFixture: Readonly<ReverseQueryInterface> = Object.freeze<ReverseQueryInterface>({
    lat: 41.7340186,
    lon: -87.5960762,
    countryCode: 'US',
    limit: 3,
    language: Query.DEFAULT_RESULT_LANGUAGE,
    withRaw: true,
});

export const suggestQueryFixture: Readonly<SuggestQueryInterface> = Object.freeze<SuggestQueryInterface>({
    ...geocodeQueryFixture,
});

export const placeDetailsQueryFixture: Readonly<PlaceDetailsQueryInterface> = Object.freeze<PlaceDetailsQueryInterface>({
    placeId: '', // you must set placeId in the specific test
    countryCode: 'US',
    language: Query.DEFAULT_RESULT_LANGUAGE,
    withRaw: true,
});

export const distanceQueryFixture: Readonly<DistanceQueryInterface> = Object.freeze<DistanceQueryInterface>({
    from: {
        lat: 40.871994,
        lon: -74.425937,
    },
    to: {
        lat: 40.863008,
        lon: -74.385286,
    },
    mode: TravelModeEnum.DRIVING,
    language: Query.DEFAULT_RESULT_LANGUAGE,
    countryCode: 'US',
    withRaw: true,
});

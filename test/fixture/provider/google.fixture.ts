import { LocationInterface, SuggestionInterface } from '../../../src/interface';

const providerRawLocationResponse: Readonly<any> = Object.freeze({
    results: [
        {
            address_components: [
                { long_name: '1158', short_name: '1158', types: ['street_number'] },
                { long_name: 'East 89th Street', short_name: 'E 89th St', types: ['route'] },
                { long_name: 'Burnside', short_name: 'Burnside', types: ['neighborhood', 'political'] },
                { long_name: 'Chicago', short_name: 'Chicago', types: ['locality', 'political'] },
                { long_name: 'Cook County', short_name: 'Cook County', types: ['administrative_area_level_2', 'political'] },
                { long_name: 'Illinois', short_name: 'IL', types: ['administrative_area_level_1', 'political'] },
                { long_name: 'United States', short_name: 'US', types: ['country', 'political'] },
                { long_name: '60619', short_name: '60619', types: ['postal_code'] },
                { long_name: '7017', short_name: '7017', types: ['postal_code_suffix'] },
            ],
            formatted_address: '1158 E 89th St, Chicago, IL 60619, USA',
            geometry: {
                location: { lat: 41.7340186, lng: -87.5960762 },
                location_type: 'RANGE_INTERPOLATED',
                viewport: {
                    northeast: { lat: 41.73536758029149, lng: -87.59472721970849 },
                    southwest: { lat: 41.7326696197085, lng: -87.59742518029151 },
                },
            },
            place_id: 'EiYxMTU4IEUgODl0aCBTdCwgQ2hpY2FnbywgSUwgNjA2MTksIFVTQSIbEhkKFAoSCdl6YuIgJg6IEUtCPVsYYuvuEIYJ',
            types: ['street_address'],
        },
    ],
    status: 'OK',
});

const providerParsedLocationResponse: ReadonlyArray<LocationInterface> = Object.freeze<LocationInterface>([
    {
        formattedAddress: '1158 E 89th St, Chicago, IL 60619, USA',
        latitude: 41.7340186,
        longitude: -87.5960762,
        country: 'United States',
        countryCode: 'US',
        state: 'Illinois',
        stateCode: 'IL',
        city: 'Chicago',
        streetName: 'East 89th Street',
        houseNumber: '1158',
        postalCode: '60619',
        provider: 'GoogleMapsProvider',
        raw: providerRawLocationResponse.results[0],
    },
]);

export const providerRawGeocodeResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedGeocodeResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawReverseResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedReverseResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawSuggestResponse: Readonly<any> = Object.freeze({
    predictions: [
        {
            description: '1158 East 89th Street, Chicago, IL, USA',
            id: 'e0a391cdbe024898ee821d3de48d13600934bed4',
            matched_substrings: [
                {
                    length: 21,
                    offset: 0,
                },
            ],
            place_id: 'EicxMTU4IEVhc3QgODl0aCBTdHJlZXQsIENoaWNhZ28sIElMLCBVU0EiMRIvChQKEgnZemLiICYOiBFLQj1bGGLr7hCGCSoUChIJCQJVUComDogR4NP62uoauTA',
            reference: 'EicxMTU4IEVhc3QgODl0aCBTdHJlZXQsIENoaWNhZ28sIElMLCBVU0EiMRIvChQKEgnZemLiICYOiBFLQj1bGGLr7hCGCSoUChIJCQJVUComDogR4NP62uoauTA',
            structured_formatting: {
                main_text: '1158 East 89th Street',
                main_text_matched_substrings: [
                    {
                        length: 21,
                        offset: 0,
                    },
                ],
                secondary_text: 'Chicago, IL, USA',
            },
            terms: [
                {
                    offset: 0,
                    value: '1158 East 89th Street',
                },
                {
                    offset: 23,
                    value: 'Chicago',
                },
                {
                    offset: 32,
                    value: 'IL',
                },
                {
                    offset: 36,
                    value: 'USA',
                },
            ],
            types: ['route', 'geocode'],
        },
    ],
    status: 'OK',
});

export const providerParsedSuggestResponse: ReadonlyArray<SuggestionInterface> = Object.freeze<SuggestionInterface>([
    {
        formattedAddress: '1158 East 89th Street, Chicago, IL, USA',
        provider: 'GoogleMapsProvider',
        raw: providerRawSuggestResponse.predictions[0],
    },
]);

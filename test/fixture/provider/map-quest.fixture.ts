import { LocationInterface, SuggestionInterface } from '../../../src/interface';
import { Query } from '../../../src/model';

const providerRawLocationResponse: Readonly<any> = Object.freeze({
    info: {
        statuscode: 0,
        copyright: { text: '© 2019 MapQuest, Inc.', imageUrl: 'http://api.mqcdn.com/res/mqlogo.gif', imageAltText: '© 2019 MapQuest, Inc.' },
        messages: [],
    },
    options: { maxResults: Query.DEFAULT_RESULT_LIMIT, thumbMaps: false, ignoreLatLngInput: false },
    results: [
        {
            providedLocation: { location: '1158 E 89th St' },
            locations: [
                {
                    street: '1158 E 89th St',
                    adminArea6: '',
                    adminArea6Type: 'Neighborhood',
                    adminArea5: 'Brooklyn',
                    adminArea5Type: 'City',
                    adminArea4: 'Kings',
                    adminArea4Type: 'County',
                    adminArea3: 'NY',
                    adminArea3Type: 'State',
                    adminArea1: 'US',
                    adminArea1Type: 'Country',
                    postalCode: '11236-4763',
                    geocodeQualityCode: 'L1AAA',
                    geocodeQuality: 'ADDRESS',
                    dragPoint: false,
                    sideOfStreet: 'R',
                    linkId: 'rnr3494469|i44367001',
                    unknownInput: '',
                    type: 's',
                    latLng: { lat: 40.635334, lng: -73.901844 },
                    displayLatLng: { lat: 40.635183, lng: -73.901976 },
                },
            ],
        },
    ],
});

const providerParsedLocationResponse: ReadonlyArray<LocationInterface> = Object.freeze<LocationInterface>([
    {
        latitude: 40.635334,
        longitude: -73.901844,
        formattedAddress: '1158 E 89th St, Brooklyn, NY 11236-4763, US',
        country: 'United States',
        countryCode: 'US',
        state: 'New York',
        stateCode: 'NY',
        city: 'Brooklyn',
        streetName: '1158 E 89th St',
        houseNumber: undefined,
        postalCode: '11236-4763',
        provider: 'MapQuestProvider',
        raw: providerRawLocationResponse.results[0].locations[0],
    },
]);

export const providerRawGeocodeResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedGeocodeResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawReverseResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedReverseResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawSuggestResponse: Readonly<any> = Object.freeze({
    request: {
        q: '1158 E 89th St',
        limit: 3,
        location: {
            long: -87.5960762,
            lat: 41.7340186,
        },
        feedback: false,
        collection: ['address'],
        languageCode: 'en',
        countryCode: ['US'],
    },
    results: [
        {
            id: 'address:1158_144a1ec42e9c88c9cf013e003cfef404',
            displayString: '1158 E 89th St, Chicago, IL 60619-7017',
            name: '1158 E 89th St',
            recordType: 'address',
            collection: ['address'],
            slug: '/us/illinois/chicago/60619-7017/1158-e-89th-st-41.733137,-87.595598',
            language: 'en',
            place: {
                type: 'Feature',
                geometry: {
                    coordinates: [-87.595598, 41.733137],
                    type: 'Point',
                },
                properties: {
                    city: 'Chicago',
                    stateCode: 'IL',
                    postalCode: '60619-7017',
                    county: 'Cook',
                    countryCode: 'US',
                    street: '1158 E 89th St',
                    type: 'address',
                },
            },
        },
        {
            id: 'address:1158_48ae48d7816cd2cad4203b56dfe49df7',
            displayString: '1158 E 89th St, Minneapolis, MN 55420',
            name: '1158 E 89th St',
            recordType: 'address',
            collection: ['address'],
            slug: '/us/minnesota/minneapolis/55420/1158-e-89th-st-44.842529,-93.273597',
            language: 'en',
            place: {
                type: 'Feature',
                geometry: {
                    coordinates: [-93.273597, 44.842529],
                    type: 'Point',
                },
                properties: {
                    city: 'Minneapolis',
                    stateCode: 'MN',
                    postalCode: '55420',
                    county: 'Hennepin',
                    countryCode: 'US',
                    street: '1158 E 89th St',
                    type: 'address',
                },
            },
        },
        {
            id: 'address:1158_f710ec0e9a6a396c9e2da3080bc5d913',
            displayString: '1158 E 89th St, Kansas City, MO 64131-2749',
            name: '1158 E 89th St',
            recordType: 'address',
            collection: ['address'],
            slug: '/us/missouri/kansas-city/64131-2749/1158-e-89th-st-38.966144,-94.575587',
            language: 'en',
            place: {
                type: 'Feature',
                geometry: {
                    coordinates: [-94.575587, 38.966144],
                    type: 'Point',
                },
                properties: {
                    city: 'Kansas City',
                    stateCode: 'MO',
                    postalCode: '64131-2749',
                    county: 'Jackson',
                    countryCode: 'US',
                    street: '1158 E 89th St',
                    type: 'address',
                },
            },
        },
    ],
});

export const providerParsedSuggestResponse: ReadonlyArray<SuggestionInterface> = Object.freeze<SuggestionInterface>([
    {
        formattedAddress: '1158 E 89th St, Chicago, IL 60619-7017',
        provider: 'MapQuestProvider',
        raw: providerRawSuggestResponse.results[0],
    },
    {
        formattedAddress: '1158 E 89th St, Minneapolis, MN 55420',
        provider: 'MapQuestProvider',
        raw: providerRawSuggestResponse.results[1],
    },
    {
        formattedAddress: '1158 E 89th St, Kansas City, MO 64131-2749',
        provider: 'MapQuestProvider',
        raw: providerRawSuggestResponse.results[2],
    },
]);

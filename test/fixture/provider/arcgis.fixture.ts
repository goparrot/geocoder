import { LocationInterface, PlaceDetailsQueryInterface, SuggestionInterface } from '../../../src/interface';
import { placeDetailsQueryFixture } from '../model/query.fixture';

export const providerRawGeocodeResponse: Readonly<any> = Object.freeze({
    spatialReference: {
        wkid: 4326,
        latestWkid: 4326,
    },
    candidates: [
        {
            address: '1158 E 89th St, Chicago, Illinois, 60619',
            location: {
                x: -87.59600346556464,
                y: 41.733182329890155,
            },
            score: 100,
            attributes: {
                LongLabel: '1158 E 89th St, Chicago, IL, 60619, USA',
                Addr_type: 'StreetAddress',
                AddNum: '1158',
                StAddr: '1158 E 89th St',
                City: 'Chicago',
                Region: 'Illinois',
                RegionAbbr: 'IL',
                Postal: '60619',
                Country: 'USA',
                DisplayX: -87.59600346556464,
                DisplayY: 41.733182329890155,
            },
            extent: {
                xmin: -87.59700346556464,
                ymin: 41.73218232989016,
                xmax: -87.59500346556463,
                ymax: 41.73418232989015,
            },
        },
    ],
});

export const providerParsedGeocodeResponse: ReadonlyArray<LocationInterface> = Object.freeze<LocationInterface>([
    {
        formattedAddress: '1158 E 89th St, Chicago, IL, 60619, USA',
        latitude: 41.733182329890155,
        longitude: -87.59600346556464,
        country: 'United States',
        countryCode: 'US',
        state: 'Illinois',
        stateCode: 'IL',
        city: 'Chicago',
        streetName: 'E 89th St',
        houseNumber: '1158',
        postalCode: '60619',
        placeId: undefined,
        provider: 'ArcgisProvider',
        raw: providerRawGeocodeResponse.candidates[0],
    },
]);

export const providerRawReverseResponse: Readonly<any> = Object.freeze({
    address: {
        Match_addr: '250 W 18th St, New York, 10011',
        LongLabel: '250 W 18th St, New York, NY, 10011, USA',
        ShortLabel: '250 W 18th St',
        Addr_type: 'PointAddress',
        Type: '',
        PlaceName: '',
        AddNum: '250',
        Address: '250 W 18th St',
        Block: '',
        Sector: '',
        Neighborhood: 'Chelsea',
        District: '',
        City: 'New York',
        MetroArea: 'New York City Metro',
        Subregion: 'New York County',
        Region: 'New York',
        Territory: '',
        Postal: '10011',
        PostalExt: '',
        CountryCode: 'USA',
    },
    location: {
        x: -74,
        y: 40.74185,
        spatialReference: {
            wkid: 4326,
            latestWkid: 4326,
        },
    },
});

export const providerParsedReverseResponse: ReadonlyArray<LocationInterface> = Object.freeze<LocationInterface>([
    {
        formattedAddress: '250 W 18th St, New York, NY, 10011, USA',
        latitude: 40.74185,
        longitude: -74,
        country: 'United States',
        countryCode: 'US',
        state: 'New York',
        stateCode: 'NY',
        city: 'New York',
        postalCode: '10011',
        streetName: 'W 18th St',
        houseNumber: '250',
        placeId: undefined,
        provider: 'ArcgisProvider',
        raw: providerRawReverseResponse,
    },
]);

export const providerRawSuggestResponse: Readonly<any> = Object.freeze({
    suggestions: [
        {
            text: '1158 E 89th St, Brooklyn, NY, 11236, USA',
            magicKey: 'dHA9MCNsb2M9NTAxMzE2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
        {
            text: '1158 E 89th St, Chicago, IL, 60619, USA',
            magicKey: 'dHA9MCNsb2M9Njk0MDM2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
        {
            text: '1158 E 89th St, Kansas City, MO, 64131, USA',
            magicKey: 'dHA9MCNsb2M9MTE2NTQ3OSNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
    ],
});

export const providerParsedSuggestResponse: ReadonlyArray<SuggestionInterface> = Object.freeze<SuggestionInterface>([
    {
        formattedAddress: '1158 E 89th St, Brooklyn, NY, 11236, USA',
        placeId: 'dHA9MCNsb2M9NTAxMzE2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
        provider: 'ArcgisProvider',
        raw: {
            text: '1158 E 89th St, Brooklyn, NY, 11236, USA',
            magicKey: 'dHA9MCNsb2M9NTAxMzE2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
    },
    {
        formattedAddress: '1158 E 89th St, Chicago, IL, 60619, USA',
        placeId: 'dHA9MCNsb2M9Njk0MDM2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
        provider: 'ArcgisProvider',
        raw: {
            text: '1158 E 89th St, Chicago, IL, 60619, USA',
            magicKey: 'dHA9MCNsb2M9Njk0MDM2MCNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
    },
    {
        formattedAddress: '1158 E 89th St, Kansas City, MO, 64131, USA',
        placeId: 'dHA9MCNsb2M9MTE2NTQ3OSNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
        provider: 'ArcgisProvider',
        raw: {
            text: '1158 E 89th St, Kansas City, MO, 64131, USA',
            magicKey: 'dHA9MCNsb2M9MTE2NTQ3OSNsbmc9MzMjaG49MTE1OCNsYnM9MTA5OjEwNDI0MzI0',
            isCollection: false,
        },
    },
]);

export const providerPlaceDetailsQueryFixture: Readonly<PlaceDetailsQueryInterface> = Object.freeze<PlaceDetailsQueryInterface>({
    ...placeDetailsQueryFixture,
    ...{
        placeId: providerParsedSuggestResponse[1].placeId,
    },
});

export const providerRawPlaceDetailsResponse: Readonly<any> = Object.freeze({
    result: providerRawGeocodeResponse.candidates[0],
    status: 'OK',
});

export const providerParsedPlaceDetailsResponse: Readonly<LocationInterface> = Object.freeze<LocationInterface>({
    ...providerParsedGeocodeResponse[0],
    ...{
        placeId: providerParsedSuggestResponse[1].placeId,
    },
});

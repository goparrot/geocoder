import { LocationInterface, PlaceDetailsQueryInterface, SuggestionInterface } from '../../../src/interface';
import { placeDetailsQueryFixture } from '../model/query.fixture';

const providerRawLocationResponse: Readonly<any> = Object.freeze({
    Response: {
        MetaInfo: { Timestamp: '2019-02-19T23:39:16.057+0000' },
        View: [
            {
                _type: 'SearchResultsViewType',
                ViewId: 0,
                Result: [
                    {
                        Relevance: 0.89,
                        MatchLevel: 'houseNumber',
                        MatchQuality: { Country: 1, State: 1, City: 1, Street: [1], HouseNumber: 1, PostalCode: 1 },
                        MatchType: 'interpolated',
                        Location: {
                            LocationId: 'NT_.4F.1wbQ1kZP.RMjIh-x1A_xETN4A',
                            LocationType: 'point',
                            DisplayPosition: { Latitude: 41.7332449, Longitude: -87.5960168 },
                            NavigationPosition: [{ Latitude: 41.73311, Longitude: -87.5960168 }],
                            MapView: {
                                TopLeft: { Latitude: 41.7343691, Longitude: -87.5975232 },
                                BottomRight: { Latitude: 41.7321207, Longitude: -87.5945104 },
                            },
                            Address: {
                                Label: '1158 E 89th St, Chicago, IL 60619, United States',
                                Country: 'USA',
                                State: 'IL',
                                County: 'Cook',
                                City: 'Chicago',
                                District: 'Burnside',
                                Street: 'E 89th St',
                                HouseNumber: '1158',
                                PostalCode: '60619',
                                AdditionalData: [
                                    { value: 'US', key: 'Country2' },
                                    { value: 'United States', key: 'CountryName' },
                                    { value: 'Illinois', key: 'StateName' },
                                    { value: 'Cook', key: 'CountyName' },
                                    { value: 'N', key: 'PostalCodeType' },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
});

const providerParsedLocationResponse: ReadonlyArray<LocationInterface> = Object.freeze<LocationInterface>([
    {
        latitude: 41.7332449,
        longitude: -87.5960168,
        country: 'United States',
        countryCode: 'US',
        state: 'Illinois',
        stateCode: 'IL',
        city: 'Chicago',
        streetName: 'E 89th St',
        houseNumber: '1158',
        postalCode: '60619',
        placeId: 'NT_.4F.1wbQ1kZP.RMjIh-x1A_xETN4A',
        provider: 'HereProvider',
        formattedAddress: '1158 E 89th St, Chicago, IL 60619, United States',
        raw: providerRawLocationResponse.Response.View[0].Result[0],
    },
]);

export const providerRawGeocodeResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedGeocodeResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawReverseResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedReverseResponse: ReadonlyArray<LocationInterface> = providerParsedLocationResponse;

export const providerRawSuggestResponse: Readonly<any> = providerRawLocationResponse;
export const providerParsedSuggestResponse: ReadonlyArray<SuggestionInterface> = Object.freeze<SuggestionInterface>([
    {
        formattedAddress: providerRawLocationResponse.Response.View[0].Result[0].Location.Address.Label,
        placeId: providerRawLocationResponse.Response.View[0].Result[0].Location.LocationId,
        provider: 'HereProvider',
        raw: providerRawLocationResponse.Response.View[0].Result[0],
    },
]);

export const providerPlaceDetailsQueryFixture: Readonly<PlaceDetailsQueryInterface> = Object.freeze<PlaceDetailsQueryInterface>({
    ...placeDetailsQueryFixture,
    ...{
        placeId: providerParsedLocationResponse[0].placeId!,
    },
});

export const providerRawPlaceDetailsResponse: Readonly<any> = Object.freeze({
    Response: {
        MetaInfo: {
            Timestamp: '2019-04-03T15:46:01.349+0000',
        },
        View: [
            {
                _type: 'SearchResultsViewType',
                ViewId: 0,
                Result: [
                    {
                        Relevance: 0,
                        MatchLevel: 'houseNumber',
                        MatchType: 'interpolated',
                        Location: {
                            LocationId: 'NT_.4F.1wbQ1kZP.RMjIh-x1A_xETN4A',
                            LocationType: 'address',
                            DisplayPosition: {
                                Latitude: 41.7332449,
                                Longitude: -87.5960168,
                            },
                            NavigationPosition: [
                                {
                                    Latitude: 41.73311,
                                    Longitude: -87.5960168,
                                },
                            ],
                            MapView: {
                                TopLeft: {
                                    Latitude: 41.7343691,
                                    Longitude: -87.5975232,
                                },
                                BottomRight: {
                                    Latitude: 41.7321207,
                                    Longitude: -87.5945104,
                                },
                            },
                            Address: {
                                Label: '1158 E 89th St, Chicago, IL 60619, United States',
                                Country: 'USA',
                                State: 'IL',
                                County: 'Cook',
                                City: 'Chicago',
                                District: 'Burnside',
                                Street: 'E 89th St',
                                HouseNumber: '1158',
                                PostalCode: '60619',
                                AdditionalData: [
                                    {
                                        value: 'US',
                                        key: 'Country2',
                                    },
                                    {
                                        value: 'United States',
                                        key: 'CountryName',
                                    },
                                    {
                                        value: 'Illinois',
                                        key: 'StateName',
                                    },
                                    {
                                        value: 'Cook',
                                        key: 'CountyName',
                                    },
                                    {
                                        value: 'N',
                                        key: 'PostalCodeType',
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
});

export const providerParsedPlaceDetailsResponse: Readonly<LocationInterface> = Object.freeze<LocationInterface>({
    ...providerParsedGeocodeResponse[0],
    ...{
        placeId: providerPlaceDetailsQueryFixture.placeId,
        raw: providerRawPlaceDetailsResponse.Response.View[0].Result[0],
    },
});

import { LocationInterface } from '../../../src/interface';
import { Query } from '../../../src/model';
import { MapQuestProvider } from '../../../src/provider';

export const plainFullFilledResponseObject: any = {
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
};

export const plainParsedResponseObject: LocationInterface[] = [
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
        provider: MapQuestProvider.name,
    },
];

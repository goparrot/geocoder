import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { delay } from '../../../src';
import { Geocoder } from '../../../src/geocoder';
import { GoogleMapsProvider } from '../../../src/provider';
import {
    distanceQueryFixture,
    geocodeQueryFixture,
    geocodeQueryFixtureForAustralia,
    geocodeQueryFixtureForCountryWithoutStateCode,
    reverseQueryFixture,
    suggestQueryFixture,
} from '../../fixture/model/query.fixture';
import { providerParsedPlaceDetailsResponse, providerPlaceDetailsQueryFixture } from '../../fixture/provider/google.fixture';
import type { Location } from '../../../src/model';
import type { GeocodeQueryInterface, PlaceDetailsQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../../../src/interface';
import type { Distance, DistanceQueryInterface } from '../../../src';

describe('GoogleMapsProvider (integration)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;
    let geocodeQuery: GeocodeQueryInterface;
    let geocodeQueryForAustralia: GeocodeQueryInterface;
    let geocodeQueryForCountryWithoutStateCode: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let suggestQuery: SuggestQueryInterface;
    let placeDetailsQuery: PlaceDetailsQueryInterface;
    let distanceQuery: DistanceQueryInterface;

    beforeEach(async () => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };
        suggestQuery = { ...suggestQueryFixture };
        suggestQuery = { ...suggestQueryFixture };
        distanceQuery = { ...distanceQueryFixture };
        geocodeQueryForAustralia = { ...geocodeQueryFixtureForAustralia };
        geocodeQueryForCountryWithoutStateCode = { ...geocodeQueryFixtureForCountryWithoutStateCode };

        placeDetailsQuery = { ...providerPlaceDetailsQueryFixture };

        client = axios.create();

        const provider: GoogleMapsProvider = new GoogleMapsProvider(client, `${process.env.GOOGLE_MAPS_API_KEY}`);

        geocoder = new Geocoder(provider);

        // google maps api quote is 10 rps
        await delay(500);
    });

    describe('#geocode', () => {
        it('should return expected response', async () => {
            return geocoder.geocode(geocodeQuery).should.eventually.be.an('array').with.length(1);
        });

        it('should return expected response for Australia address', async () => {
            return geocoder.geocode(geocodeQueryForAustralia).should.eventually.be.an('array').with.length(1);
        });

        // geocode for Moldova stopped working with postCode query param
        it.skip('should return expected response for country without stateCode', async () => {
            return geocoder.geocode(geocodeQueryForCountryWithoutStateCode).should.eventually.be.an('array').with.length(1);
        });
    });

    describe('#reverse', () => {
        it('should return expected response', async () => {
            return geocoder.reverse(reverseQuery).should.eventually.be.an('array').with.length(3);
        });
    });

    describe('#suggest', () => {
        it('should return expected response', async () => {
            return geocoder.suggest(suggestQuery).should.eventually.be.an('array').with.length(1);
        });
    });

    describe('#placeDetails', () => {
        it('should return expected response', async () => {
            const location: Location = await geocoder.using(GoogleMapsProvider).placeDetails(placeDetailsQuery);

            // sometimes this field is not returned
            delete location.raw.id;
            delete location.raw.scope;

            return location.should.be.deep.eq(providerParsedPlaceDetailsResponse);
        });
    });

    describe('#distance', () => {
        it('should return expected response', async () => {
            const distance: Distance = await geocoder.using(GoogleMapsProvider).distance(distanceQuery);

            // return distance.should.be.deep.eq(providerParsedDistanceResponse);
            distance.should.have.property('distance');
            distance.distance.should.be.a('number');

            distance.should.have.property('duration');
            distance.duration.should.be.a('number');

            distance.should.have.property('provider');
            distance.provider.should.be.deep.eq(GoogleMapsProvider.name);

            distance.should.have.property('raw');
            distance.raw.should.be.an('object');
        });
    });
});

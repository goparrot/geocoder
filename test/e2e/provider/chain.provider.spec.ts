import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ChainProvider, Geocoder, HereProvider } from '../../../src';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsProvider } from '../../../src/provider';
import { plainFullFilledGeocodeQueryObject, plainFullFilledReverseQueryObject } from '../../fixture/model/query.fixture';
import { plainFullFilledResponseObject, plainParsedResponseObject } from '../../fixture/provider/google.fixture';

chai.use(chaiAsPromised);
chai.should();

describe('ChainProvider (2e2)', () => {
    let mock: MockAdapter;
    let geocoder: Geocoder;
    let geocodeQueryFixture: GeocodeQueryInterface;
    let reverseQueryFixture: ReverseQueryInterface;
    let mapQuestProvider: HereProvider;
    let googleProvider: GoogleMapsProvider;

    beforeEach(() => {
        geocodeQueryFixture = { ...plainFullFilledGeocodeQueryObject };
        reverseQueryFixture = { ...plainFullFilledReverseQueryObject };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        mapQuestProvider = new HereProvider(client, 'test', 'test');
        googleProvider = new GoogleMapsProvider(client, 'test');

        geocoder = new Geocoder(new ChainProvider([mapQuestProvider, googleProvider]));
    });

    describe('#geocode', () => {
        it('should fail for HereProvider and succeed for GoogleMapsProvider', async () => {
            mock.onGet(mapQuestProvider.geocodeUrl).reply(401);
            mock.onGet(googleProvider.geocodeUrl).reply(200, plainFullFilledResponseObject);

            return geocoder.geocode(geocodeQueryFixture).should.become(plainParsedResponseObject);
        });
    });

    describe('#reverse', () => {
        it('should fail for HereProvider and succeed for GoogleMapsProvider', async () => {
            mock.onGet(mapQuestProvider.reverseUrl).reply(401);
            mock.onGet(googleProvider.reverseUrl).reply(200, plainFullFilledResponseObject);

            return geocoder.reverse(reverseQueryFixture).should.become(plainParsedResponseObject);
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    AccuracyEnum,
    GoogleMapsGeocodeCommand,
    GoogleMapsReverseCommand,
    MapQuestGeocodeCommand,
    MapQuestProvider,
    MapQuestReverseCommand,
    StatefulChainProvider,
} from '../../../src';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/google.fixture';

describe('StatefulChainProvider (2e2)', () => {
    let mock: MockAdapter;
    let provider: StatefulChainProvider;
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let mapQuestProvider: MapQuestProvider;
    let googleProvider: GoogleMapsProvider;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        mapQuestProvider = new MapQuestProvider(client, 'test');
        googleProvider = new GoogleMapsProvider(client, 'test');

        provider = new StatefulChainProvider([mapQuestProvider, googleProvider]);
    });

    describe('#geocode', () => {
        it('should fail for MapQuestProvider (mock http status 401) and succeed for GoogleMapsProvider', async () => {
            mock.onGet(MapQuestGeocodeCommand.getUrl()).reply(401);
            mock.onGet(GoogleMapsGeocodeCommand.getUrl()).reply(200, providerRawResponse);

            return provider.geocode(geocodeQuery).should.become(providerParsedResponse);
        });

        it('should fail for MapQuestProvider (does not support AccuracyEnum.HOUSE_NUMBER) and succeed for GoogleMapsProvider', async () => {
            geocodeQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            mock.onGet(GoogleMapsGeocodeCommand.getUrl()).reply(200, providerRawResponse);

            return provider.geocode(geocodeQuery).should.become(providerParsedResponse);
        });
    });

    describe('#reverse', () => {
        it('should fail for MapQuestProvider (mock http status 401) and succeed for GoogleMapsProvider', async () => {
            mock.onGet(MapQuestReverseCommand.getUrl()).reply(401);
            mock.onGet(GoogleMapsReverseCommand.getUrl()).reply(200, providerRawResponse);

            return provider.reverse(reverseQuery).should.become(providerParsedResponse);
        });

        it('should fail for MapQuestProvider (does not support AccuracyEnum.HOUSE_NUMBER) and succeed for GoogleMapsProvider', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            mock.onGet(GoogleMapsReverseCommand.getUrl()).reply(200, providerRawResponse);

            return provider.reverse(reverseQuery).should.become(providerParsedResponse);
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { GeocodeQueryInterface, QueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { GoogleMapsGeocodeCommand, GoogleMapsProvider, GoogleMapsReverseCommand, GoogleMapsSuggestCommand, StatefulChainProvider } from '../../../src/provider';
import { ArcgisGeocodeCommand, ArcgisProvider, ArcgisReverseCommand, ArcgisSuggestCommand } from '../../../src/provider/arcgis';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/google.fixture';
import { sharedAccuracyBehaviours } from '../common/shared';

describe('StatefulChainProvider (2e2)', () => {
    const client: AxiosInstance = Axios.create();
    const mock: MockAdapter = new MockAdapter(client);

    let provider: StatefulChainProvider = new StatefulChainProvider([new ArcgisProvider(client), new GoogleMapsProvider(client, 'test')]);

    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let suggestQuery: SuggestQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };
        suggestQuery = { ...suggestQueryFixture };

        provider = new StatefulChainProvider([new ArcgisProvider(client), new GoogleMapsProvider(client, 'test')]);
    });

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, _parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);
    }

    describe('#geocode', () => {
        sharedBehaviours(GoogleMapsGeocodeCommand.getUrl(), 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);

        it('should fail for ArcgisProvider (mock http status 401) and succeed for GoogleMapsProvider', async () => {
            mock.onGet(ArcgisGeocodeCommand.getUrl()).reply(401);
            mock.onGet(GoogleMapsGeocodeCommand.getUrl()).reply(200, providerRawGeocodeResponse);

            return provider.geocode(geocodeQuery).should.become(providerParsedGeocodeResponse);
        });

        it('should fail for ArcgisProvider (does not support AccuracyEnum.HOUSE_NUMBER) and succeed for GoogleMapsProvider', async () => {
            geocodeQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            mock.onGet(GoogleMapsGeocodeCommand.getUrl()).reply(200, providerRawGeocodeResponse);

            return provider.geocode(geocodeQuery).should.become(providerParsedGeocodeResponse);
        });

        it('should return empty array', async () => {
            mock.onGet(ArcgisGeocodeCommand.getUrl()).reply(200, []);
            mock.onGet(GoogleMapsGeocodeCommand.getUrl()).reply(200, []);

            return provider.geocode(geocodeQuery).should.become([]);
        });
    });

    describe('#reverse', () => {
        sharedBehaviours(GoogleMapsReverseCommand.getUrl(), 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);

        it('should fail for ArcgisProvider (mock http status 401) and succeed for GoogleMapsProvider', async () => {
            mock.onGet(ArcgisReverseCommand.getUrl()).reply(401);
            mock.onGet(GoogleMapsReverseCommand.getUrl()).reply(200, providerRawReverseResponse);

            return provider.reverse(reverseQuery).should.become(providerParsedReverseResponse);
        });

        it('should fail for ArcgisProvider (does not support AccuracyEnum.HOUSE_NUMBER) and succeed for GoogleMapsProvider', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            mock.onGet(GoogleMapsReverseCommand.getUrl()).reply(200, providerRawReverseResponse);

            return provider.reverse(reverseQuery).should.become(providerParsedReverseResponse);
        });

        it('should return empty array', async () => {
            mock.onGet(ArcgisReverseCommand.getUrl()).reply(200, []);
            mock.onGet(GoogleMapsReverseCommand.getUrl()).reply(200, []);

            return provider.reverse(reverseQuery).should.become([]);
        });
    });

    describe('#suggest', () => {
        sharedBehaviours(GoogleMapsSuggestCommand.getUrl(), 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);

        it('should fail for ArcgisProvider (mock http status 401) and succeed for GoogleMapsProvider', async () => {
            mock.onGet(ArcgisSuggestCommand.getUrl()).reply(401);
            mock.onGet(GoogleMapsSuggestCommand.getUrl()).reply(200, providerRawSuggestResponse);

            return provider.suggest(suggestQuery).should.become(providerParsedSuggestResponse);
        });

        it('should fail for ArcgisProvider (does not support AccuracyEnum.HOUSE_NUMBER) and succeed for GoogleMapsProvider', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            mock.onGet(GoogleMapsSuggestCommand.getUrl()).reply(200, providerRawSuggestResponse);

            return provider.suggest(suggestQuery).should.become(providerParsedSuggestResponse);
        });

        it('should return empty array', async () => {
            mock.onGet(ArcgisSuggestCommand.getUrl()).reply(500);
            mock.onGet(GoogleMapsSuggestCommand.getUrl()).reply(500);

            return provider.suggest(suggestQuery).should.become([]);
        });
    });
});

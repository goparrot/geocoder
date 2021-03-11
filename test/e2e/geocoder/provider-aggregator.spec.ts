import type { AxiosInstance } from 'axios';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ProviderAggregator } from '../../../src/geocoder';
import type { QueryInterface } from '../../../src/interface';
import { NullLogger } from '../../../src/logger';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisGeocodeCommand, ArcgisProvider, ArcgisReverseCommand, ArcgisSuggestCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/arcgis.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours, sharedProvidableBehaviours } from '../common/shared';

describe('ProviderAggregator (2e2)', () => {
    const client: AxiosInstance = Axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const geocoder: ProviderAggregator = new ProviderAggregator([new ArcgisProvider(client)]);

    geocoder.setLogger(new NullLogger());

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedCommandBehaviours(mock, geocoder, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, geocoder, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);
    }

    sharedProvidableBehaviours(ProviderAggregator as any);

    describe('#geocode', () => {
        const url: string = ArcgisGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
    });

    describe('#reverse', () => {
        const url: string = ArcgisReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });

    describe('#suggest', () => {
        const url: string = ArcgisSuggestCommand.getUrl();

        sharedBehaviours(url, 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);
    });
});

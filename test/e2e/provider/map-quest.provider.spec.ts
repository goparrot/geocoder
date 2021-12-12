import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestGeocodeCommand, MapQuestProvider, MapQuestReverseCommand, MapQuestSuggestCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/map-quest.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';
import type { QueryInterface } from '../../../src/interface';

describe('MapQuestProvider (2e2)', () => {
    const client: AxiosInstance = axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: MapQuestProvider = new MapQuestProvider(client, 'test');

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedCommandBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.STREET_NAME);

        describe('#sharedBehaviours', () => {
            it('should return empty result on response with empty results array', async () => {
                mock.onGet(provider[url]).reply(200, {
                    results: [],
                });

                return provider[method](query).should.become([]);
            });
        });
    }

    describe('#geocode', () => {
        const url: string = MapQuestGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);

        it('should return empty result on response with empty results[0].locations array', async () => {
            mock.onGet(provider[url]).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
            });

            return provider.geocode(geocodeQueryFixture).should.become([]);
        });
    });

    describe('#reverse', () => {
        const url: string = MapQuestReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);

        it('should return empty result on response with empty results[0].locations array', async () => {
            mock.onGet(provider[url]).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
            });

            return provider.reverse(reverseQueryFixture).should.become([]);
        });
    });

    describe.skip('#suggest', () => {
        const url: string = MapQuestSuggestCommand.getUrl();

        sharedBehaviours(url, 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);

        it('should return empty result on response with empty results[0].locations array', async () => {
            mock.onGet(provider[url]).reply(200, {
                results: [],
            });

            return provider.suggest(suggestQueryFixture).should.become([]);
        });
    });
});

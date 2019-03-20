import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { QueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestGeocodeCommand, MapQuestProvider, MapQuestReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
} from '../../fixture/provider/map-quest.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';

describe('MapQuestProvider (2e2)', () => {
    const client: AxiosInstance = Axios.create();
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

            it('should return empty result on response with empty results[0].locations array', async () => {
                mock.onGet(provider[url]).reply(200, {
                    results: [
                        {
                            locations: [],
                        },
                    ],
                });

                return provider[method](query).should.become([]);
            });
        });
    }

    describe('#geocode', () => {
        const url: string = MapQuestGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
    });

    describe('#reverse', () => {
        const url: string = MapQuestReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });
});

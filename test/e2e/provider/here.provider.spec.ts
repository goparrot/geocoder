import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LocationInterface, QueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { HereGeocodeCommand, HereProvider, HereReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/here.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';

describe('HereProvider (2e2)', () => {
    const client: AxiosInstance = Axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: HereProvider = new HereProvider(client, 'test', 'test');

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<LocationInterface>): void {
        query = { ...query };

        sharedCommandBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);

        describe('#sharedBehaviours', () => {
            it('should return response with empty array', async () => {
                mock.onGet(provider[url]).reply(200, {
                    Response: {
                        View: [],
                    },
                });

                return provider[method](query).should.become([]);
            });
        });
    }

    describe('#geocode', () => {
        const url: string = HereGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawResponse, providerParsedResponse);
    });

    describe('#reverse', () => {
        const url: string = HereReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawResponse, providerParsedResponse);
    });
});

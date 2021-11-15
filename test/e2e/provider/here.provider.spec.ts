import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { AccuracyEnum } from '../../../src/model';
import { HereGeocodeCommand, HereProvider, HereReverseCommand, HereSuggestCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/here.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';
import type { QueryInterface } from '../../../src/interface';

describe('HereProvider (2e2)', () => {
    const client: AxiosInstance = axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: HereProvider = new HereProvider(client, 'test', 'test');

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
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

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
    });

    describe('#reverse', () => {
        const url: string = HereReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });

    describe('#suggest', () => {
        const url: string = HereSuggestCommand.getUrl();

        sharedBehaviours(url, 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);
    });
    //
    // describe('#placeDetails', () => {
    //     const url: string = HerePlaceDetailsCommand.getUrl();
    //
    //     sharedBehaviours(url, 'placeDetails', providerPlaceDetailsQueryFixture, providerRawPlaceDetailsResponse, providerParsedPlaceDetailsResponse);
    // });
});

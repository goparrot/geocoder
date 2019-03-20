import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../src/exception';
import { QueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { GoogleMapsGeocodeCommand, GoogleMapsProvider, GoogleMapsReverseCommand, GoogleMapsSuggestCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/google.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';

describe('GoogleMapsProvider (2e2)', () => {
    const client: AxiosInstance = Axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: GoogleMapsProvider = new GoogleMapsProvider(client, 'test');

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedCommandBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);

        describe('#sharedBehaviours', () => {
            it('should throw InvalidCredentialsException', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'REQUEST_DENIED',
                    error_message: 'The provided API key is invalid.',
                });

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
            });

            it('should throw InvalidServerResponseException on REQUEST_DENIED', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'REQUEST_DENIED',
                    error_message: 'Some other error',
                });

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, 'API key is invalid');
            });

            it('should throw QuotaExceededException on OVER_QUERY_LIMIT', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'OVER_QUERY_LIMIT',
                });

                return provider[method](query).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
            });

            it('should throw QuotaExceededException on OVER_DAILY_LIMIT', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'OVER_DAILY_LIMIT',
                });

                return provider[method](query).should.be.rejectedWith(QuotaExceededException, 'Daily quota exceeded');
            });

            it('should throw InvalidArgumentException on INVALID_REQUEST', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'INVALID_REQUEST',
                });

                return provider[method](query).should.be.rejectedWith(InvalidArgumentException, 'Invalid request');
            });

            it('should throw InvalidServerResponseException on UNKNOWN_ERROR', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'UNKNOWN_ERROR',
                });

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, 'Unknown error');
            });

            it('should throw InvalidServerResponseException', async () => {
                const status: string = '___CUSTOM_UNKNOWN_STATUS_ERROR____';

                mock.onGet(provider[url]).reply(200, {
                    status,
                });

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, `Unknown status "${status}" error`);
            });

            it('should not throw any Exception', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'ZERO_RESULTS',
                });

                return provider[method](query).should.be.fulfilled;
            });
        });
    }

    describe('#geocode', () => {
        const url: string = GoogleMapsGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
    });

    describe('#reverse', () => {
        const url: string = GoogleMapsReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });

    describe('#suggest', () => {
        const url: string = GoogleMapsSuggestCommand.getUrl();

        sharedBehaviours(url, 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);
    });
});

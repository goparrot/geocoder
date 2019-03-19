import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../src/exception';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsGeocodeCommand, GoogleMapsProvider, GoogleMapsReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/google.fixture';

describe('GoogleMapsProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let provider: GoogleMapsProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new GoogleMapsProvider(client, 'test');
    });

    describe('#geocode', () => {
        const url: string = GoogleMapsGeocodeCommand.getUrl();

        it('should return success response', async () => {
            mock.onGet(url).reply(200, providerRawResponse);

            return provider.geocode(geocodeQuery).should.become(providerParsedResponse);
        });

        it('should return empty result on empty response', async () => {
            mock.onGet(url).reply(200, '');

            return provider.geocode(geocodeQuery).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(url).reply(200, {});

            return provider.geocode(geocodeQuery).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(url).reply(200, {});

            return provider.geocode(geocodeQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(url).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'The provided API key is invalid.',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidServerResponseException on REQUEST_DENIED', async () => {
            mock.onGet(url).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'Some other error',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException, 'API key is invalid');
        });

        it('should throw QuotaExceededException on OVER_QUERY_LIMIT', async () => {
            mock.onGet(url).reply(200, {
                status: 'OVER_QUERY_LIMIT',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw QuotaExceededException on OVER_DAILY_LIMIT', async () => {
            mock.onGet(url).reply(200, {
                status: 'OVER_DAILY_LIMIT',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(QuotaExceededException, 'Daily quota exceeded');
        });

        it('should throw InvalidArgumentException on INVALID_REQUEST', async () => {
            mock.onGet(url).reply(200, {
                status: 'INVALID_REQUEST',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidArgumentException, 'Invalid request');
        });

        it('should throw InvalidServerResponseException on UNKNOWN_ERROR', async () => {
            mock.onGet(url).reply(200, {
                status: 'UNKNOWN_ERROR',
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException, 'Unknown error');
        });

        it('should throw InvalidServerResponseException', async () => {
            const status: string = '___CUSTOM_UNKNOWN_STATUS_ERROR____';

            mock.onGet(url).reply(200, {
                status,
            });

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException, `Unknown status "${status}" error`);
        });

        it('should not throw any Exception', async () => {
            mock.onGet(url).reply(200, {
                status: 'ZERO_RESULTS',
            });

            return provider.geocode(geocodeQuery).should.be.fulfilled;
        });

        it('should throw InvalidServerResponseException on 500 http status', async () => {
            mock.onGet(url).reply(500);

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });

    describe('#reverse', () => {
        const url: string = GoogleMapsReverseCommand.getUrl();

        it('should return success response', async () => {
            mock.onGet(url).reply(200, providerRawResponse);

            return provider.reverse(reverseQuery).should.become(providerParsedResponse);
        });

        it('should return empty result on empty response', async () => {
            mock.onGet(url).reply(200, '');

            return provider.reverse(reverseQuery).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(url).reply(200, {});

            return provider.reverse(reverseQuery).should.become([]);
        });

        it('should throw InvalidServerResponseException on REQUEST_DENIED', async () => {
            mock.onGet(url).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'Some other error',
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException, 'API key is invalid');
        });

        it('should throw QuotaExceededException on OVER_QUERY_LIMIT', async () => {
            mock.onGet(url).reply(200, {
                status: 'OVER_QUERY_LIMIT',
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw QuotaExceededException on OVER_DAILY_LIMIT', async () => {
            mock.onGet(url).reply(200, {
                status: 'OVER_DAILY_LIMIT',
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(QuotaExceededException, 'Daily quota exceeded');
        });

        it('should throw InvalidArgumentException on INVALID_REQUEST', async () => {
            mock.onGet(url).reply(200, {
                status: 'INVALID_REQUEST',
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidArgumentException, 'Invalid request');
        });

        it('should throw InvalidServerResponseException on UNKNOWN_ERROR', async () => {
            mock.onGet(url).reply(200, {
                status: 'UNKNOWN_ERROR',
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException, 'Unknown error');
        });

        it('should throw InvalidServerResponseException', async () => {
            const status: string = '___CUSTOM_UNKNOWN_STATUS_ERROR____';

            mock.onGet(url).reply(200, {
                status,
            });

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException, `Unknown status "${status}" error`);
        });

        it('should not throw any Exception', async () => {
            mock.onGet(url).reply(200, {
                status: 'ZERO_RESULTS',
            });

            return provider.reverse(reverseQuery).should.be.fulfilled;
        });

        it('should throw InvalidServerResponseException on 500 http status', async () => {
            mock.onGet(url).reply(500);

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });
});

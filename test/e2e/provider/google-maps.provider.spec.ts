import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/google.fixture';

describe('GoogleMapsProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let geocoder: Geocoder;
    let provider: GoogleMapsProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new GoogleMapsProvider(client, 'test');

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        it('should return success response', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

            return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
        });

        it('should throw InvalidServerResponseException on empty response', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, '');

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException, /Invalid server response/);
        });

        it('should return empty results on response with empty json', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {});

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'The provided API key is invalid.',
            });

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'Some other error',
            });

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException, 'Some other error');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                status: 'OVER_QUERY_LIMIT',
            });

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(QuotaExceededException);
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(provider.geocodeUrl).reply(500);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });

    describe('#reverse', () => {
        it('should return success response', async () => {
            mock.onGet(provider.reverseUrl).reply(200, providerRawResponse);

            return geocoder.reverse(reverseQuery).should.become(providerParsedResponse);
        });

        it('should throw InvalidServerResponseException on empty response', async () => {
            mock.onGet(provider.reverseUrl).reply(200, '');

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException, /Invalid server response/);
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                status: 'REQUEST_DENIED',
                error_message: 'Some other error',
            });

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException, 'Some other error');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                status: 'OVER_QUERY_LIMIT',
            });

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(QuotaExceededException);
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(provider.reverseUrl).reply(500);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });
});

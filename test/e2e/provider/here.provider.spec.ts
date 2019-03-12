import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { HereProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/here.fixture';

describe('HereProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let geocoder: Geocoder;
    let provider: HereProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new HereProvider(client, 'test', 'test');

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

        it('should return response with empty array', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                Response: {
                    View: [],
                },
            });

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(provider.geocodeUrl).reply(401);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(provider.geocodeUrl).reply(403);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(provider.geocodeUrl).reply(429);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
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

        it('should return empty results on response with empty json', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {});

            return geocoder.reverse(reverseQuery).should.become([]);
        });

        it('should return response with empty array', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                Response: {
                    View: [],
                },
            });

            return geocoder.reverse(reverseQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(provider.reverseUrl).reply(401);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(provider.reverseUrl).reply(403);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(provider.reverseUrl).reply(429);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(provider.reverseUrl).reply(500);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });
});

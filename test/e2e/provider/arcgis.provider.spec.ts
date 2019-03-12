import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, LocationInterface, ReverseQueryInterface } from '../../../src/interface';
import { QueryInterface } from '../../../src/interface/query.interface';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
} from '../../fixture/provider/arcgis.fixture';

describe('ArcgisProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let geocoder: Geocoder;
    let provider: ArcgisProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new ArcgisProvider(client);

        geocoder = new Geocoder(provider);
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<LocationInterface>): void {
        describe('#sharedBehaviours', () => {
            it('should return success response', async () => {
                mock.onGet(provider[url]).reply(200, rawResponse);

                return provider[method](query).should.become(parsedResponse);
            });

            it('should throw InvalidServerResponseException on empty response', async () => {
                mock.onGet(provider[url]).reply(200, '');

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, /Invalid server response/);
            });

            it('should return empty results on response with empty json', async () => {
                mock.onGet(provider[url]).reply(200, {});

                return provider[method](query).should.become([]);
            });

            it('should throw InvalidCredentialsException for code 403', async () => {
                mock.onGet(provider[url]).reply(200, {
                    error: {
                        code: 403,
                        message: 'Token is valid but access is denied.',
                        details: ['User does not have permissions to store geocoding results.'],
                    },
                });

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'Token is valid but access is denied.');
            });

            it('should throw InvalidCredentialsException for code 498', async () => {
                mock.onGet(provider[url]).reply(200, {
                    error: {
                        code: 498,
                        message: 'Invalid Token',
                        details: [],
                    },
                });

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'Invalid Token');
            });

            it('should throw InvalidCredentialsException for code 498', async () => {
                mock.onGet(provider[url]).reply(200, {
                    error: {
                        code: 499,
                        message: 'Token required but not passed in the request.',
                        details: ['Token required'],
                    },
                });

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'Token required but not passed in the request.');
            });

            it('should throw InvalidServerResponseException for other codes', async () => {
                mock.onGet(provider[url]).reply(200, {
                    error: {
                        code: 0,
                        message: 'Some other error',
                        details: ['Some other error details'],
                    },
                });

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, 'Some other error');
            });
        });
    }

    describe('#geocode', () => {
        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
                    it(`should return correct values for AccuracyEnum.${key}`, async () => {
                        geocodeQuery.accuracy = accuracy;

                        mock.onGet(provider.geocodeUrl).reply(200, providerRawGeocodeResponse);

                        return geocoder.geocode(geocodeQuery).should.fulfilled;
                    });
                }
            });
        }

        sharedBehaviours('geocodeUrl', 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
        sharedAccuracyBehaviours();

        it('should return response with empty array', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                candidates: [],
            });

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        // Covered by GeocodeQuery validation
        it.skip('should throw InvalidArgumentException', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                error: {
                    code: 400,
                    extendedCode: -2147467259,
                    message: 'Unable to complete operation.',
                    details: ["'Address' parameter value exceeds the maximum length of 100 characters allowed for the parameter value."],
                },
            });

            geocodeQuery.address = 'VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS';

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidArgumentException, 'Unable to complete operation.');
        });
    });

    describe('#reverse', () => {
        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const accuracy of Object.values(AccuracyEnum)) {
                    it(`should return correct values for AccuracyEnum.${accuracy}`, async () => {
                        reverseQuery.accuracy = accuracy;

                        mock.onGet(provider.reverseUrl).reply(200, providerRawReverseResponse);

                        return geocoder.reverse(reverseQuery).should.fulfilled;
                    });
                }
            });
        }

        sharedBehaviours('reverseUrl', 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
        sharedAccuracyBehaviours();

        it('should throw InvalidArgumentException', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                error: {
                    code: 400,
                    extendedCode: -2147467259,
                    message: 'Unable to complete operation.',
                    details: [],
                },
            });

            reverseQuery.lon = '' as any;

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidArgumentException, 'Unable to complete operation.');
        });
    });
});

import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    InvalidArgumentException,
    InvalidCredentialsException,
    InvalidServerResponseException,
    NotFoundException,
    QuotaExceededException,
} from '../../../src/exception';
import { AccuracyEnum } from '../../../src/model';
import {
    GoogleMapsDistanceCommand,
    GoogleMapsGeocodeCommand,
    GoogleMapsPlaceDetailsCommand,
    GoogleMapsProvider,
    GoogleMapsReverseCommand,
    GoogleMapsSuggestCommand,
} from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerDistanceQueryFixture,
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerPlaceDetailsQueryFixture,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/google.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';
import type { QueryInterface } from '../../../src/interface';
import type { GeocoderException } from '../../../src/exception';
import type { AxiosInstance } from 'axios';

describe('GoogleMapsProvider (2e2)', () => {
    const client: AxiosInstance = Axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: GoogleMapsProvider = new GoogleMapsProvider(client, 'test');

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface): void {
        query = { ...query };

        describe('#sharedBehaviours', () => {
            it('should throw InvalidCredentialsException on REQUEST_DENIED for invalid api key', async () => {
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

            it('should throw NotFoundException on NOT_FOUND', async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'NOT_FOUND',
                });

                return provider[method](query).should.be.rejectedWith(NotFoundException, 'Not found');
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

            it('should throw InvalidServerResponseException on unknown status', async () => {
                const status: string = '___UNKNOWN_STATUS_ERROR___';

                mock.onGet(provider[url]).reply(200, {
                    status,
                });

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, `Unknown response status "${status}"`);
            });

            if (['placeDetails', 'distance'].includes(method)) {
                it('should throw NotFoundException on ZERO_RESULTS', async () => {
                    mock.onGet(provider[url]).reply(200, {
                        status: 'ZERO_RESULTS',
                    });

                    return provider[method](query).should.be.rejectedWith(NotFoundException);
                });
            } else {
                it('should not throw any Exception on ZERO_RESULTS', async () => {
                    mock.onGet(provider[url]).reply(200, {
                        status: 'ZERO_RESULTS',
                    });

                    return provider[method](query).should.be.fulfilled;
                });
            }
        });
    }

    function allSharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedBehaviours(url, method, query);

        sharedCommandBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);
    }

    describe('#geocode', () => {
        const url: string = GoogleMapsGeocodeCommand.getUrl();
        const method: string = 'geocode';

        allSharedBehaviours(url, method, geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);
    });

    describe('#reverse', () => {
        const url: string = GoogleMapsReverseCommand.getUrl();
        const method: string = 'reverse';

        allSharedBehaviours(url, method, reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });

    describe('#suggest', () => {
        const url: string = GoogleMapsSuggestCommand.getUrl();
        const method: string = 'suggest';

        allSharedBehaviours(url, method, suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);
    });

    describe('#placeDetails', () => {
        const url: string = GoogleMapsPlaceDetailsCommand.getUrl();
        const method: string = 'placeDetails';

        sharedBehaviours(url, method, providerPlaceDetailsQueryFixture);
    });

    describe('#distance', () => {
        const url: string = GoogleMapsDistanceCommand.getUrl();
        const method: string = 'distance';
        const query = { ...providerDistanceQueryFixture };

        sharedBehaviours(url, method, query);

        it('should throw InvalidServerResponseException on empty data', async () => {
            mock.onGet(provider[url]).reply(200, undefined);

            return provider[method](query).should.be.rejectedWith(InvalidServerResponseException, 'Empty response data');
        });

        const additionalRootLevelExceptionMap = new Map<string, typeof GeocoderException>([
            ['MAX_DIMENSIONS_EXCEEDED', QuotaExceededException],
            ['MAX_ELEMENTS_EXCEEDED', QuotaExceededException],
        ]);

        for (const [status, exceptionClass] of additionalRootLevelExceptionMap.entries()) {
            it(`should throw ${exceptionClass.name} on ${status} status`, async () => {
                mock.onGet(provider[url]).reply(200, {
                    status,
                });

                return provider[method](query).should.be.rejectedWith(exceptionClass);
            });
        }

        const elementsExceptionMap = new Map<string, typeof GeocoderException>([
            ['NOT_FOUND', NotFoundException],
            ['ZERO_RESULTS', NotFoundException],
            ['MAX_ROUTE_LENGTH_EXCEEDED', InvalidArgumentException],
            ['___UNKNOWN_STATUS_ERROR___', InvalidServerResponseException],
        ]);

        for (const [status, exceptionClass] of elementsExceptionMap.entries()) {
            it(`should throw ${exceptionClass.name} on ${status} in response.data rows.elements.status`, async () => {
                mock.onGet(provider[url]).reply(200, {
                    status: 'OK',
                    rows: [
                        {
                            elements: [
                                {
                                    status,
                                },
                            ],
                        },
                    ],
                });

                return provider[method](query).should.be.rejectedWith(exceptionClass);
            });
        }
    });
});

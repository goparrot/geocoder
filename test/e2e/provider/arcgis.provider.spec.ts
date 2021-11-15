import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { InvalidArgumentException, InvalidCredentialsException, InvalidServerResponseException } from '../../../src/exception';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisGeocodeCommand, ArcgisProvider, ArcgisReverseCommand, ArcgisSuggestCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import {
    providerParsedGeocodeResponse,
    providerParsedReverseResponse,
    providerParsedSuggestResponse,
    providerPlaceDetailsQueryFixture,
    providerRawGeocodeResponse,
    providerRawReverseResponse,
    providerRawSuggestResponse,
} from '../../fixture/provider/arcgis.fixture';
import { sharedAccuracyBehaviours, sharedCommandBehaviours } from '../common/shared';
import type { GeocodeQueryInterface, QueryInterface, SuggestQueryInterface } from '../../../src/interface';

describe('ArcgisProvider (2e2)', () => {
    const client: AxiosInstance = axios.create();
    const mock: MockAdapter = new MockAdapter(client);
    const provider: ArcgisProvider = new ArcgisProvider(client);

    let geocodeQuery: GeocodeQueryInterface;
    let suggestQuery: SuggestQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        suggestQuery = { ...suggestQueryFixture };
    });

    afterEach(() => {
        mock.reset();
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface): void {
        query = { ...query };

        describe('#sharedBehaviours', () => {
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

    function allSharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<any>): void {
        query = { ...query };

        sharedBehaviours(url, method, query);

        sharedCommandBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);

        sharedAccuracyBehaviours(mock, provider, url, method, query, rawResponse, AccuracyEnum.HOUSE_NUMBER);
    }

    describe('#geocode', () => {
        const url: string = ArcgisGeocodeCommand.getUrl();

        allSharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawGeocodeResponse, providerParsedGeocodeResponse);

        it('should return response with empty array', async () => {
            mock.onGet(url).reply(200, {
                candidates: [],
            });

            return provider.geocode(geocodeQuery).should.become([]);
        });

        // Covered by GeocodeQuery validation
        it.skip('should throw InvalidArgumentException', async () => {
            mock.onGet(url).reply(200, {
                error: {
                    code: 400,
                    extendedCode: -2147467259,
                    message: 'Unable to complete operation.',
                    details: ["'Address' parameter value exceeds the maximum length of 100 characters allowed for the parameter value."],
                },
            });

            geocodeQuery.address = 'VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS_VERY_LONG_ADDRESS';

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidArgumentException, 'Unable to complete operation.');
        });
    });

    describe('#reverse', () => {
        const url: string = ArcgisReverseCommand.getUrl();

        allSharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawReverseResponse, providerParsedReverseResponse);
    });

    describe('#suggest', () => {
        const url: string = ArcgisSuggestCommand.getUrl();

        allSharedBehaviours(url, 'suggest', suggestQueryFixture, providerRawSuggestResponse, providerParsedSuggestResponse);

        it('should return response with empty array', async () => {
            mock.onGet(url).reply(200, {
                suggestions: [],
            });

            return provider.suggest(suggestQuery).should.become([]);
        });
    });

    describe('#placeDetails', () => {
        const url: string = ArcgisSuggestCommand.getUrl();

        sharedBehaviours(url, 'placeDetails', providerPlaceDetailsQueryFixture);
    });
});

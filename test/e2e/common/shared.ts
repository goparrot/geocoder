import type { AxiosInstance } from 'axios';
import Axios from 'axios';
import type MockAdapter from 'axios-mock-adapter';
import type { GeocoderInterface, Type } from '../../../src';
import {
    ExactMatchNotFoundException,
    InvalidCredentialsException,
    InvalidServerResponseException,
    ProviderNotRegisteredException,
    QuotaExceededException,
    UnsupportedAccuracyException,
    ValidationException,
} from '../../../src/exception';
import type { ProviderInterface, QueryInterface } from '../../../src/interface';
import type { LoggableInterface } from '../../../src/logger';
import { NullLogger } from '../../../src/logger';
import type { AbstractProvider, ProvidableInterface } from '../../../src/model';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisProvider, GoogleMapsProvider, MapQuestProvider } from '../../../src/provider';
import { getAvailableAccuracies } from '../../../src/util';

export function sharedCommandResultBehaviours(
    mock: MockAdapter,
    provider: GeocoderInterface,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: unknown,
    parsedResponse: unknown,
): void {
    describe('#sharedCommandBehaviours', () => {
        it('should return success response', async () => {
            mock.onGet(provider[url]).reply(200, rawResponse);

            return provider[method](query).should.become(parsedResponse);
        });

        it('should return empty result on empty response', async () => {
            mock.onGet(provider[url]).reply(200, '');

            return provider[method](query).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(provider[url]).reply(200, {});

            return provider[method](query).should.become([]);
        });
    });
}

export function sharedCommandHttpStatusBehaviours(mock: MockAdapter, provider: GeocoderInterface, url: string, method: string, query: QueryInterface): void {
    describe('#sharedCommandHttpStatusBehaviours', () => {
        it('should throw InvalidCredentialsException on 401 http status', async () => {
            mock.onGet(provider[url]).reply(401);

            return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidCredentialsException on 403 http status', async () => {
            mock.onGet(provider[url]).reply(403);

            return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw QuotaExceededException on 429 http status', async () => {
            mock.onGet(provider[url]).reply(429);

            return provider[method](query).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw InvalidServerResponseException on 500 http status', async () => {
            mock.onGet(provider[url]).reply(500);

            return provider[method](query).should.be.rejectedWith(InvalidServerResponseException);
        });

        it('should throw InvalidServerResponseException on 0 http status', async () => {
            mock.onGet(provider[url]).reply(0);

            return provider[method](query).should.be.rejectedWith(InvalidServerResponseException);
        });
    });
}

export function sharedCommandBehaviours(
    mock: MockAdapter,
    provider: GeocoderInterface,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: unknown,
    parsedResponse: unknown,
): void {
    sharedCommandResultBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);
    sharedCommandHttpStatusBehaviours(mock, provider, url, method, query);
}

export function sharedGeocodeCommandBehaviours(mock: MockAdapter, provider: AbstractProvider, url: string, rawResponse: unknown): void {
    describe('#sharedGeocodeCommandBehaviours', () => {
        describe('#exactMatch', () => {
            it('should throw ExactMatchNotFoundException with "More than one result" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider
                    .geocode({
                        exactMatch: true,
                        address: 'test123',
                    })
                    .should.be.rejectedWith(ExactMatchNotFoundException, 'More than one result');
            });

            it('should throw ExactMatchNotFoundException with "Does not match the terms of the query" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider
                    .geocode({
                        exactMatch: true,
                        address: 'test123',
                        countryCode: 'AA',
                    })
                    .should.be.rejectedWith(ExactMatchNotFoundException, 'Does not match the terms of the query');
            });

            it('should throw ExactMatchNotFoundException with "Does not match the terms of the query" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider
                    .geocode({
                        exactMatch: true,
                        address: 'test123',
                        stateCode: 'AA',
                    })
                    .should.be.rejectedWith(ExactMatchNotFoundException, 'Does not match the terms of the query');
            });
        });
    });
}

export function sharedAccuracyBehaviours(
    mock: MockAdapter,
    provider: GeocoderInterface,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: unknown,
    maxAccuracy: AccuracyEnum,
): void {
    describe('#sharedAccuracyBehaviours', () => {
        const availableAccuracies: string[] = getAvailableAccuracies(maxAccuracy);

        for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
            if (availableAccuracies.includes(accuracy)) {
                it(`should return correct values for AccuracyEnum.${key}`, async () => {
                    query.accuracy = accuracy;

                    mock.onGet(provider[url]).reply(200, rawResponse);

                    return provider[method](query).should.fulfilled;
                });
            } else {
                it(`should throw UnsupportedAccuracyException for unsupported AccuracyEnum.${key}`, async () => {
                    query.accuracy = AccuracyEnum.HOUSE_NUMBER;

                    return provider[method](query).should.be.rejectedWith(UnsupportedAccuracyException);
                });
            }
        }

        it(`should return correct values without accuracy`, async () => {
            delete query.accuracy;

            mock.onGet(provider[url]).reply(200, rawResponse);

            return provider[method](query).should.fulfilled;
        });

        // it(`should throw ValidationException for unknown AccuracyEnum value`, async () => {
        //     query.accuracy = '__SOME_VALUE__' as AccuracyEnum;
        //
        //     return provider[method](query).should.be.rejectedWith(ValidationException, 'Validation Failed.');
        // });
    });
}

export function sharedProvidableBehaviours(providableClass: Type<ProviderInterface & ProvidableInterface & LoggableInterface>): void {
    describe('#sharedProvidableBehaviours', () => {
        const client: AxiosInstance = Axios.create();
        const googleProvider: GoogleMapsProvider = new GoogleMapsProvider(client, 'test');

        let provider: ProviderInterface & ProvidableInterface & LoggableInterface;

        beforeEach(() => {
            provider = new providableClass([new ArcgisProvider(client)]);
        });

        describe('#constructor', () => {
            it('should throw ProviderNotRegisteredException if provider array is empty', async () => {
                return ((): any => new providableClass([])).should.throw(ProviderNotRegisteredException, 'No provider registered.');
            });
        });

        describe('#geocode', () => {
            it('should be instance of Function', async () => {
                return provider.geocode.should.be.instanceOf(Function);
            });

            it('should throw ValidationException on short address', async () => {
                return provider
                    .geocode({
                        address: 'test',
                    })
                    .should.be.rejectedWith(ValidationException);
            });
        });

        describe('#reverse', () => {
            it('should be instance of Function', async () => {
                return provider.reverse.should.be.instanceOf(Function);
            });

            it('should throw ValidationException on invalid lat option', async () => {
                return provider
                    .reverse({
                        lat: 123,
                        lon: 123,
                    })
                    .should.be.rejectedWith(ValidationException);
            });

            it('should throw ValidationException on invalid lon option', async () => {
                return provider
                    .reverse({
                        lat: 90,
                        lon: 200,
                    })
                    .should.be.rejectedWith(ValidationException);
            });
        });

        describe('#suggest', () => {
            it('should be instance of Function', async () => {
                return provider.suggest.should.be.instanceOf(Function);
            });

            it('should throw ValidationException on short address', async () => {
                return provider
                    .suggest({
                        address: 'test',
                    })
                    .should.be.rejectedWith(ValidationException);
            });
        });

        describe('#getProviders', () => {
            it('should be instance of Function', async () => {
                return provider.getProviders.should.be.instanceOf(Function);
            });

            it('should return array', async () => {
                return provider.getProviders().should.be.an('array');
            });

            it('should have one provider', async () => {
                return provider.getProviders().should.have.length(1);
            });
        });

        describe('#registerProvider', () => {
            it('should be instance of Function', async () => {
                return provider.registerProvider.should.be.instanceOf(Function);
            });

            it('should return this', async () => {
                return provider.registerProvider(googleProvider).should.be.instanceOf(providableClass);
            });

            it('should register provider', async () => {
                provider.registerProvider(googleProvider);

                return provider.getProviders().should.have.length(2);
            });
        });

        describe('#registerProviders', () => {
            it('should be instance of Function', async () => {
                return provider.registerProviders.should.be.instanceOf(Function);
            });

            it('should return this', async () => {
                return provider.registerProviders([googleProvider]).should.be.instanceOf(providableClass);
            });

            it('should do nothing', async () => {
                provider.registerProviders([]);

                return provider.getProviders().should.have.length(1);
            });

            it('should register two providers', async () => {
                provider.registerProviders([googleProvider, new MapQuestProvider(client, 'test')]);

                return provider.getProviders().should.have.length(3);
            });
        });

        describe('#setLogger', () => {
            it('should be instance of Function', async () => {
                return provider.setLogger.should.be.instanceOf(Function);
            });

            it('should return instance of this', async () => {
                return provider.setLogger(new NullLogger()).should.be.instanceOf(providableClass);
            });
        });

        describe('#getLogger', () => {
            it('should be instance of Function', async () => {
                return provider.getLogger.should.be.instanceOf(Function);
            });

            it('should return instance of NullLogger', async () => {
                return provider.getLogger().should.be.instanceOf(NullLogger);
            });

            it('should return instance of CustomLogger', async () => {
                provider.setLogger(new NullLogger());
                return provider.getLogger().should.be.instanceOf(NullLogger);
            });
        });
    });
}

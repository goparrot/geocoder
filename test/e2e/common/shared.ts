import MockAdapter from 'axios-mock-adapter';
import {
    ExactMatchNotFoundException,
    InvalidCredentialsException,
    InvalidServerResponseException,
    QuotaExceededException,
    UnsupportedAccuracyException,
} from '../../../src/exception';
import { QueryInterface } from '../../../src/interface';
import { AbstractProvider, AccuracyEnum } from '../../../src/model';
import { getAvailableAccuracies } from '../../../src/util';

export function sharedCommandBehaviours(
    mock: MockAdapter,
    provider: AbstractProvider,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: any,
    parsedResponse: any,
): void {
    sharedCommandResultBehaviours(mock, provider, url, method, query, rawResponse, parsedResponse);
    sharedCommandHttpStatusBehaviours(mock, provider, url, method, query);
}

export function sharedCommandResultBehaviours(
    mock: MockAdapter,
    provider: AbstractProvider,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: any,
    parsedResponse: any,
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

export function sharedCommandHttpStatusBehaviours(mock: MockAdapter, provider: AbstractProvider, url: string, method: string, query: QueryInterface): void {
    describe('#sharedCommandBehaviours', () => {
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

export function sharedGeocodeCommandBehaviours(
    mock: MockAdapter,
    provider: AbstractProvider,
    url: string,
    rawResponse: any,
): void {
    describe('#sharedGeocodeCommandBehaviours', () => {
        describe('#exactMatch', () => {
            it('should throw ExactMatchNotFoundException with "More than one result" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider.geocode({
                    exactMatch: true,
                    address: 'test123',
                }).should.be.rejectedWith(ExactMatchNotFoundException, 'More than one result');
            });

            it('should throw ExactMatchNotFoundException with "Does not match the terms of the query" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider.geocode({
                    exactMatch: true,
                    address: 'test123',
                    countryCode: 'AA',
                }).should.be.rejectedWith(ExactMatchNotFoundException, 'Does not match the terms of the query');
            });

            it('should throw ExactMatchNotFoundException with "Does not match the terms of the query" message', async () => {
                mock.onGet(url).reply(200, rawResponse);

                return provider.geocode({
                    exactMatch: true,
                    address: 'test123',
                    stateCode: 'AA',
                }).should.be.rejectedWith(ExactMatchNotFoundException, 'Does not match the terms of the query');
            });
        });
    });
}

export function sharedAccuracyBehaviours(
    mock: MockAdapter,
    provider: AbstractProvider,
    url: string,
    method: string,
    query: QueryInterface,
    rawResponse: any,
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

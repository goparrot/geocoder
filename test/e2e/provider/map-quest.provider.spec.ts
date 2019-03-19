import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException, UnsupportedAccuracyException } from '../../../src/exception';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestGeocodeCommand, MapQuestProvider, MapQuestReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/map-quest.fixture';

describe('MapQuestProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let provider: MapQuestProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new MapQuestProvider(client, 'test');
    });

    describe('#geocode', () => {
        const url: string = MapQuestGeocodeCommand.getUrl();

        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
                    if (accuracy === AccuracyEnum.HOUSE_NUMBER) {
                        continue;
                    }

                    it(`should return correct values for AccuracyEnum.${key}`, async () => {
                        geocodeQuery.accuracy = accuracy;

                        mock.onGet(url).reply(200, providerParsedResponse);

                        return provider.geocode(geocodeQuery).should.fulfilled;
                    });
                }

                it('should throw UnsupportedAccuracyException for unsupported AccuracyEnum.HOUSE_NUMBER', async () => {
                    geocodeQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

                    return provider
                        .geocode(geocodeQuery)
                        .should.be.rejectedWith(
                            UnsupportedAccuracyException,
                            `Command MapQuestGeocodeCommand doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                        );
                });
            });
        }

        sharedAccuracyBehaviours();

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

        it('should return empty result on response with empty results array', async () => {
            mock.onGet(url).reply(200, {
                results: [],
            });

            return provider.geocode(geocodeQuery).should.become([]);
        });

        it('should return empty result on response with empty results[0].locations array', async () => {
            mock.onGet(url).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
            });

            return provider.geocode(geocodeQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(url).reply(401);

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(url).reply(403);

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(url).reply(429);

            return provider.geocode(geocodeQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(url).reply(500);

            return provider.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });

    describe('#reverse', () => {
        const url: string = MapQuestReverseCommand.getUrl();

        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
                    if (accuracy === AccuracyEnum.HOUSE_NUMBER) {
                        continue;
                    }

                    it(`should return correct values for AccuracyEnum.${key}`, async () => {
                        reverseQuery.accuracy = accuracy;

                        mock.onGet(url).reply(200, providerRawResponse);

                        return provider.reverse(reverseQuery).should.fulfilled;
                    });
                }

                it('should throw UnsupportedAccuracyException for unsupported AccuracyEnum.HOUSE_NUMBER', async () => {
                    reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

                    return provider
                        .reverse(reverseQuery)
                        .should.be.rejectedWith(
                            UnsupportedAccuracyException,
                            `Command MapQuestReverseCommand doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                        );
                });
            });
        }

        sharedAccuracyBehaviours();

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

        it('should return empty result on response with empty results array', async () => {
            mock.onGet(url).reply(200, {
                results: [],
            });

            return provider.reverse(reverseQuery).should.become([]);
        });

        it('should return empty result on response with empty results[0].locations array', async () => {
            mock.onGet(url).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
            });

            return provider.reverse(reverseQuery).should.become([]);
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(url).reply(401);

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw InvalidCredentialsException', async () => {
            mock.onGet(url).reply(403);

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
        });

        it('should throw QuotaExceededException', async () => {
            mock.onGet(url).reply(429);

            return provider.reverse(reverseQuery).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
        });

        it('should throw InvalidServerResponseException', async () => {
            mock.onGet(url).reply(500);

            return provider.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });

        it('should throw UnsupportedAccuracyException for unsupported AccuracyEnum.HOUSE_NUMBER', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            return provider
                .reverse(reverseQuery)
                .should.be.rejectedWith(
                    UnsupportedAccuracyException,
                    `Command MapQuestReverseCommand doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                );
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException, UnsupportedAccuracyException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/map-quest.fixture';

describe('MapQuestProvider (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let geocoder: Geocoder;
    let provider: MapQuestProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new MapQuestProvider(client, 'test');

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
                    if (accuracy === AccuracyEnum.HOUSE_NUMBER) {
                        continue;
                    }

                    it(`should return correct values for AccuracyEnum.${key}`, async () => {
                        geocodeQuery.accuracy = accuracy;

                        mock.onGet(provider.geocodeUrl).reply(200, providerParsedResponse);

                        return geocoder.geocode(geocodeQuery).should.fulfilled;
                    });
                }

                it('should throw UnsupportedAccuracyException for unsupported AccuracyEnum.HOUSE_NUMBER', async () => {
                    geocodeQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

                    return geocoder
                        .geocode(geocodeQuery)
                        .should.be.rejectedWith(
                            UnsupportedAccuracyException,
                            `provider MapQuestProvider doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                        );
                });
            });
        }

        sharedAccuracyBehaviours();

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

        it('should return empty results on response with empty results array', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                results: [],
            });

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        it('should return empty results on response with empty results[0].locations array', async () => {
            mock.onGet(provider.geocodeUrl).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
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
        function sharedAccuracyBehaviours(): void {
            describe('#sharedAccuracyBehaviours', () => {
                for (const accuracy of Object.values(AccuracyEnum)) {
                    if (accuracy === AccuracyEnum.HOUSE_NUMBER) {
                        continue;
                    }

                    it(`should return correct values for AccuracyEnum.${accuracy}`, async () => {
                        reverseQuery.accuracy = accuracy;

                        mock.onGet(provider.reverseUrl).reply(200, providerRawResponse);

                        return geocoder.reverse(reverseQuery).should.fulfilled;
                    });
                }

                it('should throw UnsupportedAccuracyException for unsupported AccuracyEnum.HOUSE_NUMBER', async () => {
                    reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

                    return geocoder
                        .reverse(reverseQuery)
                        .should.be.rejectedWith(
                            UnsupportedAccuracyException,
                            `provider MapQuestProvider doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                        );
                });
            });
        }

        sharedAccuracyBehaviours();

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

        it('should return empty results on response with empty results array', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                results: [],
            });

            return geocoder.reverse(reverseQuery).should.become([]);
        });

        it('should return empty results on response with empty results[0].locations array', async () => {
            mock.onGet(provider.reverseUrl).reply(200, {
                results: [
                    {
                        locations: [],
                    },
                ],
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

        it('should throw UnsupportedAccuracyException (does not support AccuracyEnum.HOUSE_NUMBER)', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            return geocoder
                .reverse(reverseQuery)
                .should.be.rejectedWith(
                    UnsupportedAccuracyException,
                    `provider MapQuestProvider doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                );
        });
    });
});

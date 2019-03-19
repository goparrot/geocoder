import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../../../src/exception';
import { LocationInterface, QueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { HereGeocodeCommand, HereProvider, HereReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/here.fixture';

describe('HereProvider (2e2)', () => {
    let provider: HereProvider;
    let mock: MockAdapter;

    beforeEach(() => {
        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        provider = new HereProvider(client, 'test', 'test');
    });

    function sharedBehaviours(url: string, method: string, query: QueryInterface, rawResponse: any, parsedResponse: ReadonlyArray<LocationInterface>): void {
        query = { ...query };

        describe('#sharedBehaviours', () => {
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

            it('should return response with empty array', async () => {
                mock.onGet(provider[url]).reply(200, {
                    Response: {
                        View: [],
                    },
                });

                return provider[method](query).should.become([]);
            });

            it('should throw InvalidCredentialsException', async () => {
                mock.onGet(provider[url]).reply(401);

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
            });

            it('should throw InvalidCredentialsException', async () => {
                mock.onGet(provider[url]).reply(403);

                return provider[method](query).should.be.rejectedWith(InvalidCredentialsException, 'API key is invalid');
            });

            it('should throw QuotaExceededException', async () => {
                mock.onGet(provider[url]).reply(429);

                return provider[method](query).should.be.rejectedWith(QuotaExceededException, 'Quota exceeded');
            });

            it('should throw InvalidServerResponseException', async () => {
                mock.onGet(provider[url]).reply(500);

                return provider[method](query).should.be.rejectedWith(InvalidServerResponseException);
            });

            describe('#sharedAccuracyBehaviours', () => {
                for (const [key, accuracy] of Object.entries(AccuracyEnum)) {
                    it(`should return correct values for AccuracyEnum.${key}`, async () => {
                        query.accuracy = accuracy;

                        mock.onGet(provider[url]).reply(200, providerRawResponse);

                        return provider[method](query).should.fulfilled;
                    });
                }
            });
        });
    }

    describe('#geocode', () => {
        const url: string = HereGeocodeCommand.getUrl();

        sharedBehaviours(url, 'geocode', geocodeQueryFixture, providerRawResponse, providerParsedResponse);
    });

    describe('#reverse', () => {
        const url: string = HereReverseCommand.getUrl();

        sharedBehaviours(url, 'reverse', reverseQueryFixture, providerRawResponse, providerParsedResponse);
    });
});

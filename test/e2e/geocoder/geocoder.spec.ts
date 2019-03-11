import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidServerResponseException, UnsupportedAccuracyException, ValidationException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/map-quest.fixture';

describe('Geocoder (2e2)', () => {
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
        describe('#filterByAccuracy', () => {
            it('should not use accuracy', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                delete geocodeQuery.accuracy;

                return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
            });

            it('should filter by AccuracyEnum.COUNTRY', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                geocodeQuery.accuracy = AccuracyEnum.COUNTRY;

                return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
            });

            it('should filter by AccuracyEnum.STATE', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                geocodeQuery.accuracy = AccuracyEnum.STATE;

                return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
            });

            it('should filter by AccuracyEnum.CITY', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                geocodeQuery.accuracy = AccuracyEnum.CITY;

                return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
            });

            it('should filter by AccuracyEnum.STREET_NAME', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                geocodeQuery.accuracy = AccuracyEnum.STREET_NAME;

                return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
            });

            it('should filter by AccuracyEnum.HOUSE_NUMBER', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                geocodeQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

                return geocoder
                    .geocode(geocodeQuery)
                    .should.be.rejectedWith(
                        UnsupportedAccuracyException,
                        `provider MapQuestProvider doesn't support "houseNumber" accuracy (max accuracy is "streetName")`,
                    );
            });

            it('should throw ValidationException', async () => {
                mock.onGet(provider.geocodeUrl).reply(200, providerRawResponse);

                const accuracy: string = 'string';
                geocodeQuery.accuracy = accuracy as AccuracyEnum;

                return geocoder.geocode(geocodeQuery).should.be.rejectedWith(ValidationException, 'Validation Failed.');
            });
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
            mock.onGet(provider.reverseUrl).reply(500);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });

        it('should throw ValidationException', async () => {
            mock.onGet(provider.reverseUrl).reply(200, providerRawResponse);

            const accuracy: string = 'string';
            reverseQuery.accuracy = accuracy as AccuracyEnum;

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(ValidationException, 'Validation Failed.');
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InvalidServerResponseException } from '../../../src/exception';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { NullLogger } from '../../../src/logger';
import { MapQuestGeocodeCommand, MapQuestProvider, MapQuestReverseCommand } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import { providerParsedResponse, providerRawResponse } from '../../fixture/provider/map-quest.fixture';

describe('Geocoder (2e2)', () => {
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let geocoder: Geocoder;
    let mock: MockAdapter;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        const client: AxiosInstance = Axios.create();
        mock = new MockAdapter(client);

        geocoder = new Geocoder(new MapQuestProvider(client, 'test'));
        geocoder.setLogger(new NullLogger());
    });

    describe('#geocode', () => {
        const url: string = MapQuestGeocodeCommand.getUrl();

        it('should return success response', async () => {
            mock.onGet(url).reply(200, providerRawResponse);

            return geocoder.geocode(geocodeQuery).should.become(providerParsedResponse);
        });

        it('should return empty result on empty response', async () => {
            mock.onGet(url).reply(200, '');

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(url).reply(200, {});

            return geocoder.geocode(geocodeQuery).should.become([]);
        });

        it('should throw InvalidServerResponseException on 500 http status', async () => {
            mock.onGet(url).reply(500);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException);
        });

        it('should throw InvalidServerResponseException on 0 http status', async () => {
            mock.onGet(url).reply(0);

            return geocoder.geocode(geocodeQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });

    describe('#reverse', () => {
        const url: string = MapQuestReverseCommand.getUrl();

        it('should return success response', async () => {
            mock.onGet(url).reply(200, providerRawResponse);

            return geocoder.reverse(reverseQuery).should.become(providerParsedResponse);
        });

        it('should return empty result on empty response', async () => {
            mock.onGet(url).reply(200, '');

            return geocoder.reverse(reverseQuery).should.become([]);
        });

        it('should return empty result on response with empty json', async () => {
            mock.onGet(url).reply(200, {});

            return geocoder.reverse(reverseQuery).should.become([]);
        });

        it('should throw InvalidServerResponseException on 500 http status', async () => {
            mock.onGet(url).reply(500);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });

        it('should throw InvalidServerResponseException on 0 http status', async () => {
            mock.onGet(url).reply(0);

            return geocoder.reverse(reverseQuery).should.be.rejectedWith(InvalidServerResponseException);
        });
    });
});

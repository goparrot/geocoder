import Axios from 'axios';
import type { AxiosInstance } from 'axios';
import { Geocoder } from '../../../src/geocoder';
import { MapQuestProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../../../src/interface';

describe('MapQuestProvider (integration)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let suggestQuery: SuggestQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };
        suggestQuery = { ...suggestQueryFixture };

        client = Axios.create();

        const provider: MapQuestProvider = new MapQuestProvider(client, `${process.env.MAP_QUEST_API_KEY}`);

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        it('should return expected response', async () => {
            return geocoder.geocode(geocodeQuery).should.eventually.be.an('array').with.length(1);
        });
    });

    describe('#reverse', () => {
        it('should return expected response', async () => {
            return geocoder.reverse(reverseQuery).should.eventually.be.an('array').with.length(1);
        });
    });

    describe.skip('#suggest', () => {
        it('should return expected response', async () => {
            return geocoder.suggest(suggestQuery).should.eventually.be.an('array').with.length(3);
        });
    });
});

import Axios from 'axios';
import { ProviderAggregator } from '../../../src/geocoder';
import { ArcgisProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../../../src/interface';
import type { AxiosInstance } from 'axios';

describe('ProviderAggregator (integration)', () => {
    let geocoder: ProviderAggregator;

    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let suggestQuery: SuggestQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };
        suggestQuery = { ...suggestQueryFixture };

        const client: AxiosInstance = Axios.create();

        const provider: ArcgisProvider = new ArcgisProvider(client);

        geocoder = new ProviderAggregator([provider]);
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

    describe('#suggest', () => {
        it('should return expected response', async () => {
            return geocoder.suggest(suggestQuery).should.eventually.be.an('array').with.length(3);
        });
    });
});

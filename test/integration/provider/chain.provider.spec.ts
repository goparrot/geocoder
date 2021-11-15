import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { Geocoder } from '../../../src/geocoder';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisProvider, ChainProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture, suggestQueryFixture } from '../../fixture/model/query.fixture';
import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../../../src/interface';

describe('ChainProvider (integration)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;
    let suggestQuery: SuggestQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };
        suggestQuery = { ...suggestQueryFixture };

        client = axios.create();

        const provider: ChainProvider = new ChainProvider([new ArcgisProvider(client)]);

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        it('should return response', async () => {
            return geocoder.geocode(geocodeQuery).should.eventually.be.an('array').with.length(1);
        });

        it('should return empty array', async () => {
            return geocoder
                .geocode({
                    address: '123123123',
                    exactMatch: true,
                })
                .should.eventually.be.an('array')
                .with.length(0);
        });
    });

    describe('#reverse', () => {
        it('should return expected response', async () => {
            return geocoder.reverse(reverseQuery).should.eventually.be.an('array').with.length(1);
        });

        it('should return empty array', async () => {
            return geocoder
                .reverse({
                    accuracy: AccuracyEnum.HOUSE_NUMBER,
                    lat: -1,
                    lon: -1,
                })
                .should.eventually.be.an('array')
                .with.length(0);
        });
    });

    describe('#suggest', () => {
        it('should return expected response', async () => {
            return geocoder.suggest(suggestQuery).should.eventually.be.an('array').with.length(3);
        });

        it('should return empty array', async () => {
            return geocoder
                .suggest({
                    address: '123123123',
                })
                .should.eventually.be.an('array')
                .with.length(0);
        });
    });
});

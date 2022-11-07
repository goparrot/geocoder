import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { Geocoder } from '../../../src/geocoder';
import { MapboxProvider } from '../../../src/provider';
import { geocodeQueryFixture, reverseQueryFixture } from '../../fixture/model/query.fixture';
import type { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';

describe('MapboxProvider (integration)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;
    let geocodeQuery: GeocodeQueryInterface;
    let reverseQuery: ReverseQueryInterface;

    beforeEach(() => {
        geocodeQuery = { ...geocodeQueryFixture };
        reverseQuery = { ...reverseQueryFixture };

        client = axios.create();

        const provider: MapboxProvider = new MapboxProvider(client, `${process.env.MAPBOX_ACCESS_TOKEN}`, 'mapbox.places');

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        it('should return expected response', async () => {
            return geocoder.geocode(geocodeQuery).should.eventually.be.an('array').with.length(3);
        });
    });

    describe('#reverse', () => {
        it('should return expected response', async () => {
            return geocoder.reverse(reverseQuery).should.eventually.be.an('array').with.length(3);
        });
    });
});

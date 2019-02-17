import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Geocoder } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { MapQuestProvider } from '../../../src/provider';
import { plainFullFilledGeocodeQueryObject, plainFullFilledReverseQueryObject } from '../../fixture/model/query.fixture';

chai.use(chaiAsPromised);
chai.should();

describe('MapQuestProvider (integration)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;
    let geocodeQueryFixture: GeocodeQueryInterface;
    let reverseQueryFixture: ReverseQueryInterface;

    beforeEach(() => {
        geocodeQueryFixture = { ...plainFullFilledGeocodeQueryObject };
        reverseQueryFixture = { ...plainFullFilledReverseQueryObject };

        client = Axios.create();

        const provider: MapQuestProvider = new MapQuestProvider(client, `${process.env.MAP_QUEST_API_KEY}`);

        geocoder = new Geocoder(provider);
    });

    describe('#geocode', () => {
        it('should return expected response', async () => {
            return geocoder
                .geocode(geocodeQueryFixture)
                .should.eventually.be.an('array')
                .with.lengthOf(1);
        });
    });

    describe('#reverse', () => {
        it('should return expected response', async () => {
            return geocoder
                .reverse(reverseQueryFixture)
                .should.eventually.be.an('array')
                .with.lengthOf(1);
        });
    });
});

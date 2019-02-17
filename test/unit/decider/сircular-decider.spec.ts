import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { CircularDecider } from '../../../src/decider';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsProvider, HereProvider } from '../../../src/provider';
import { plainFullFilledGeocodeQueryObject, plainFullFilledReverseQueryObject } from '../../fixture/model/query.fixture';

chai.use(chaiAsPromised);
chai.should();

describe('CircularDecider (unit)', () => {
    let decider: CircularDecider;
    let geocodeQueryFixture: GeocodeQueryInterface;
    let reverseQueryFixture: ReverseQueryInterface;
    let mapQuestProvider: HereProvider;
    let googleProvider: GoogleMapsProvider;

    beforeEach(() => {
        geocodeQueryFixture = { ...plainFullFilledGeocodeQueryObject };
        reverseQueryFixture = { ...plainFullFilledReverseQueryObject };

        decider = new CircularDecider();

        const client: AxiosInstance = Axios.create();

        mapQuestProvider = new HereProvider(client, 'test', 'test');
        googleProvider = new GoogleMapsProvider(client, 'test');
    });

    describe('#geocode', () => {
        it('should use forced provider', async () => {
            return decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider], googleProvider).should.become(googleProvider);
        });

        it('should use first provider by default', async () => {
            return decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]).should.become(googleProvider);
        });

        it('should use second provider', async () => {
            await decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]);
            return decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]).should.become(mapQuestProvider);
        });

        it('should use first provider by circular logic', async () => {
            await decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]);
            await decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]);
            return decider.geocode(geocodeQueryFixture, [googleProvider, mapQuestProvider]).should.become(googleProvider);
        });
    });

    describe('#reverse', () => {
        it('should use forced provider', async () => {
            return decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider], googleProvider).should.become(googleProvider);
        });

        it('should use first provider by default', async () => {
            return decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]).should.become(googleProvider);
        });

        it('should use second provider', async () => {
            await decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]);
            return decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]).should.become(mapQuestProvider);
        });

        it('should use first provider by circular logic', async () => {
            await decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]);
            await decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]);
            return decider.reverse(reverseQueryFixture, [googleProvider, mapQuestProvider]).should.become(googleProvider);
        });
    });
});

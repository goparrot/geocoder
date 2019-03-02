import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ProviderNotRegisteredException } from '../../../src/exception';
import { ProviderAggregator } from '../../../src/geocoder';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../../../src/interface';
import { GoogleMapsProvider, MapQuestProvider } from '../../../src/provider';
import { plainFullFilledGeocodeQueryObject, plainFullFilledReverseQueryObject } from '../../fixture/model/query.fixture';

chai.use(chaiAsPromised);
chai.should();

describe('ProviderAggregator (unit)', () => {
    let geocoder: ProviderAggregator;
    let mapQuestProvider: MapQuestProvider;
    let googleProvider: GoogleMapsProvider;
    let geocodeQueryFixture: GeocodeQueryInterface;
    let reverseQueryFixture: ReverseQueryInterface;

    beforeEach(() => {
        geocodeQueryFixture = { ...plainFullFilledGeocodeQueryObject };
        reverseQueryFixture = { ...plainFullFilledReverseQueryObject };
        const client: AxiosInstance = Axios.create();

        mapQuestProvider = new MapQuestProvider(client, 'test');
        googleProvider = new GoogleMapsProvider(client, 'test');

        geocoder = new ProviderAggregator();
    });

    describe('#constructor', () => {
        it('should be instance of ProviderAggregator', async () => {
            return geocoder.should.be.instanceOf(ProviderAggregator);
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return geocoder.geocode.should.be.instanceOf(Function);
        });

        it('should return ProviderNotRegisteredException if provider not registered', async () => {
            return geocoder.geocode(geocodeQueryFixture).should.rejectedWith(ProviderNotRegisteredException, 'No provider registered.');
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return geocoder.reverse.should.be.instanceOf(Function);
        });

        it('should return ProviderNotRegisteredException if provider not registered', async () => {
            return geocoder.reverse(reverseQueryFixture).should.rejectedWith(ProviderNotRegisteredException, 'No provider registered.');
        });
    });

    describe('#getProviders', () => {
        it('should be instance of Function', async () => {
            return geocoder.getProviders.should.be.instanceOf(Function);
        });

        it('should return array', async () => {
            return geocoder.getProviders().should.be.an('array');
        });

        it('should have zero provider', async () => {
            return geocoder.getProviders().should.have.lengthOf(0);
        });

        it('should have one providers', async () => {
            const providerAggregator: ProviderAggregator = new ProviderAggregator();
            providerAggregator.registerProviders([googleProvider]);

            return providerAggregator.getProviders().should.have.lengthOf(1);
        });
    });

    describe('#registerProvider', () => {
        it('should be instance of Function', async () => {
            return geocoder.registerProvider.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return geocoder.registerProvider(googleProvider).should.be.instanceOf(ProviderAggregator);
        });

        it('should register provider', async () => {
            geocoder.registerProvider(googleProvider);

            return geocoder.getProviders().should.have.lengthOf(1);
        });
    });

    describe('#registerProviders', () => {
        it('should be instance of Function', async () => {
            return geocoder.registerProviders.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return geocoder.registerProviders([googleProvider]).should.be.instanceOf(ProviderAggregator);
        });

        it('should do nothing', async () => {
            geocoder.registerProviders([]);

            return geocoder.getProviders().should.have.lengthOf(0);
        });

        it('should register two providers', async () => {
            geocoder.registerProviders([googleProvider, mapQuestProvider]);

            return geocoder.getProviders().should.have.lengthOf(2);
        });
    });

    describe('#using', () => {
        it('should be instance of Function', async () => {
            return geocoder.using.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return geocoder
                .registerProvider(mapQuestProvider)
                .using(MapQuestProvider)
                .should.be.instanceOf(ProviderAggregator);
        });

        it('should return ProviderNotRegisteredException if provider not registered', async () => {
            return ((): any => geocoder.using(MapQuestProvider)).should.throw(
                ProviderNotRegisteredException,
                'Provider "MapQuestProvider" is not registered, so you cannot use it. Did you forget to register it or made a typo?',
            );
        });

        it('should return ProviderNotRegisteredException if a class does not inherit AbstractProvider.', async () => {
            return ((): any => geocoder.using(ProviderAggregator)).should.throw(
                ProviderNotRegisteredException,
                'The class "ProviderAggregator" does not inherit AbstractProvider.',
            );
        });
    });
});

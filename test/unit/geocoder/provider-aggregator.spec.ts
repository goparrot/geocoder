import type { AxiosInstance } from 'axios';
import Axios from 'axios';
import { ProviderNotRegisteredException } from '../../../src/exception';
import { ProviderAggregator } from '../../../src/geocoder';
import type { LoggerInterface } from '../../../src/logger';
import { NullLogger } from '../../../src/logger';
import { ChainProvider, GoogleMapsProvider, MapQuestProvider } from '../../../src/provider';

describe('ProviderAggregator (unit)', () => {
    const client: AxiosInstance = Axios.create();
    const mapQuestProvider: MapQuestProvider = new MapQuestProvider(client, 'test');
    const googleProvider: GoogleMapsProvider = new GoogleMapsProvider(client, 'test');

    let geocoder: ProviderAggregator;

    class CustomLogger implements LoggerInterface {
        debug(): any {
            //
        }
        info(): any {
            //
        }
        warn(): any {
            //
        }
        error(): any {
            //
        }
    }

    beforeEach(() => {
        geocoder = new ProviderAggregator([mapQuestProvider]);
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return geocoder.geocode.should.be.instanceOf(Function);
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return geocoder.reverse.should.be.instanceOf(Function);
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
            return geocoder.getProviders().should.have.length(1);
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

            return geocoder.getProviders().should.have.length(2);
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

            return geocoder.getProviders().should.have.length(1);
        });

        it('should register two providers', async () => {
            geocoder.registerProviders([googleProvider]);

            return geocoder.getProviders().should.have.length(2);
        });
    });

    describe('#using', () => {
        it('should be instance of Function', async () => {
            return geocoder.using.should.be.instanceOf(Function);
        });

        it('should throw ProviderNotRegisteredException if a class does not inherit AbstractProvider', async () => {
            const errorMessage: string = 'The class "ProviderAggregator" does not inherit AbstractProvider.';

            return ((): any => geocoder.using(ProviderAggregator as any)).should.throw(ProviderNotRegisteredException, errorMessage);
        });

        it('should throw ProviderNotRegisteredException if used provider is not registered', async () => {
            const errorMessage: string =
                'Provider "GoogleMapsProvider" is not registered, so you cannot use it. Did you forget to register it or made a typo? Registered providers are: [MapQuestProvider]';

            return ((): any => geocoder.using(GoogleMapsProvider)).should.throw(ProviderNotRegisteredException, errorMessage);
        });

        it('should return chosen provider instance', async () => {
            return geocoder.using(MapQuestProvider).should.be.instanceOf(MapQuestProvider);
        });

        it('should return chosen provider instance from the chain provider', async () => {
            const customGeocoder: ProviderAggregator = new ProviderAggregator([new ChainProvider([mapQuestProvider])]);

            return customGeocoder.using(MapQuestProvider).should.be.instanceOf(MapQuestProvider);
        });

        it('should return chosen provider instance from the chain provider', async () => {
            const customGeocoder: ProviderAggregator = new ProviderAggregator([new ChainProvider([googleProvider]), mapQuestProvider]);

            return customGeocoder.using(MapQuestProvider).should.be.instanceOf(MapQuestProvider);
        });
    });

    describe('#setLogger', () => {
        it('should be instance of Function', async () => {
            return geocoder.setLogger.should.be.instanceOf(Function);
        });

        it('should return instance of this', async () => {
            return geocoder.setLogger(new CustomLogger()).should.be.instanceOf(ProviderAggregator);
        });
    });

    describe('#getLogger', () => {
        it('should be instance of Function', async () => {
            return geocoder.getLogger.should.be.instanceOf(Function);
        });

        it('should return instance of NullLogger', async () => {
            return geocoder.getLogger().should.be.instanceOf(NullLogger);
        });

        it('should return instance of CustomLogger', async () => {
            geocoder.setLogger(new CustomLogger());
            return geocoder.getLogger().should.be.instanceOf(CustomLogger);
        });
    });
});

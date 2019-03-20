import Axios, { AxiosInstance } from 'axios';
import { InvalidArgumentException, ValidationException } from '../../../src/exception';
import { NullLogger } from '../../../src/logger';
import { ArcgisProvider, GoogleMapsProvider, MapQuestProvider, StatefulChainProvider } from '../../../src/provider';

describe('StatefulChainProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: StatefulChainProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new StatefulChainProvider([new ArcgisProvider(client)]);
    });

    describe('#constructor', () => {
        it('should be instance of StatefulChainProvider', async () => {
            return provider.should.be.instanceOf(StatefulChainProvider);
        });

        it('should throw InvalidArgumentException if provider array is empty', async () => {
            return ((): any => new StatefulChainProvider([])).should.throw(InvalidArgumentException, 'array of providers should not be empty');
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return provider.geocode.should.be.instanceOf(Function);
        });

        it('should throw ValidationException on short address', async () => {
            return provider
                .geocode({
                    address: 'test',
                })
                .should.be.rejectedWith(ValidationException);
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return provider.reverse.should.be.instanceOf(Function);
        });

        it('should throw ValidationException on invalid lat option', async () => {
            return provider
                .reverse({
                    lat: 123,
                    lon: 123,
                })
                .should.be.rejectedWith(ValidationException);
        });

        it('should throw ValidationException on invalid lon option', async () => {
            return provider
                .reverse({
                    lat: 90,
                    lon: 200,
                })
                .should.be.rejectedWith(ValidationException);
        });
    });

    describe('#suggest', () => {
        it('should be instance of Function', async () => {
            return provider.suggest.should.be.instanceOf(Function);
        });

        it('should throw ValidationException on short address', async () => {
            return provider
                .suggest({
                    address: 'test',
                })
                .should.be.rejectedWith(ValidationException);
        });
    });

    describe('#getProviders', () => {
        it('should be instance of Function', async () => {
            return provider.getProviders.should.be.instanceOf(Function);
        });

        it('should return array', async () => {
            return provider.getProviders().should.be.an('array');
        });

        it('should have one provider', async () => {
            return provider.getProviders().should.have.length(1);
        });
    });

    describe('#registerProvider', () => {
        it('should be instance of Function', async () => {
            return provider.registerProvider.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return provider.registerProvider(new GoogleMapsProvider(client, 'test')).should.be.instanceOf(StatefulChainProvider);
        });

        it('should register provider', async () => {
            provider.registerProvider(new GoogleMapsProvider(client, 'test'));

            return provider.getProviders().should.have.length(2);
        });
    });

    describe('#registerProviders', () => {
        it('should be instance of Function', async () => {
            return provider.registerProviders.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return provider.registerProviders([new GoogleMapsProvider(client, 'test')]).should.be.instanceOf(StatefulChainProvider);
        });

        it('should do nothing', async () => {
            provider.registerProviders([]);

            return provider.getProviders().should.have.length(1);
        });

        it('should register two providers', async () => {
            provider.registerProviders([new GoogleMapsProvider(client, 'test'), new MapQuestProvider(client, 'test')]);

            return provider.getProviders().should.have.length(3);
        });
    });

    describe('#setLogger', () => {
        it('should be instance of Function', async () => {
            return provider.setLogger.should.be.instanceOf(Function);
        });

        it('should return instance of this', async () => {
            return provider.setLogger(new NullLogger()).should.be.instanceOf(StatefulChainProvider);
        });
    });

    describe('#getLogger', () => {
        it('should be instance of Function', async () => {
            return provider.getLogger.should.be.instanceOf(Function);
        });

        it('should return instance of NullLogger', async () => {
            return provider.getLogger().should.be.instanceOf(NullLogger);
        });

        it('should return instance of CustomLogger', async () => {
            provider.setLogger(new NullLogger());
            return provider.getLogger().should.be.instanceOf(NullLogger);
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import { plainToClass } from 'class-transformer';
import { InvalidArgumentException } from '../../../src/exception';
import { NullLogger } from '../../../src/logger';
import { GeocodeQuery, ReverseQuery } from '../../../src/model';
import { ChainProvider, GoogleMapsProvider, HereProvider, MapQuestProvider } from '../../../src/provider';

describe('ChainProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: ChainProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new ChainProvider([new HereProvider(client, 'test', 'test')]);
    });

    describe('#constructor', () => {
        it('should be instance of ChainProvider', async () => {
            return provider.should.be.instanceOf(ChainProvider);
        });

        it('should throw InvalidArgumentException if provider array is empty', async () => {
            return ((): any => new ChainProvider([])).should.throw(InvalidArgumentException, 'array of providers should not be empty');
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return provider.geocode.should.be.instanceOf(Function);
        });

        it('should return empty result array', async () => {
            return provider
                .geocode(
                    plainToClass(GeocodeQuery, {
                        address: 'test',
                    }),
                )
                .should.become([]);
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return provider.reverse.should.be.instanceOf(Function);
        });

        it('should return empty result array', async () => {
            return provider
                .reverse(
                    plainToClass(ReverseQuery, {
                        lat: 123,
                        lon: 123,
                    }),
                )
                .should.become([]);
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
            return provider.registerProvider(new GoogleMapsProvider(client, 'test')).should.be.instanceOf(ChainProvider);
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
            return provider.registerProviders([new GoogleMapsProvider(client, 'test')]).should.be.instanceOf(ChainProvider);
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
            return provider.setLogger(new NullLogger()).should.be.instanceOf(ChainProvider);
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

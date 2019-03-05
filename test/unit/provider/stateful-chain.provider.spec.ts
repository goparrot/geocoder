import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { plainToClass } from 'class-transformer';
import { InvalidArgumentException } from '../../../src/exception';
import { GeocodeQuery, ReverseQuery } from '../../../src/model';
import { GoogleMapsProvider, HereProvider, MapQuestProvider, StatefulChainProvider } from '../../../src/provider';

chai.use(chaiAsPromised);
chai.should();

describe('StatefulChainProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: StatefulChainProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new StatefulChainProvider([new HereProvider(client, 'test', 'test')]);
    });

    describe('#constructor', () => {
        it('should be instance of StatefulChainProvider', async () => {
            return provider.should.be.instanceOf(StatefulChainProvider);
        });

        it('should throw InvalidArgumentException if provider array is empty', async () => {
            return ((): any => new StatefulChainProvider([])).should.throw(InvalidArgumentException, 'provider array should not be empty');
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
            return provider.getProviders().should.have.lengthOf(1);
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

            return provider.getProviders().should.have.lengthOf(2);
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

            return provider.getProviders().should.have.lengthOf(1);
        });

        it('should register two providers', async () => {
            provider.registerProviders([new GoogleMapsProvider(client, 'test'), new MapQuestProvider(client, 'test')]);

            return provider.getProviders().should.have.lengthOf(3);
        });
    });
});

import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { plainToClass } from 'class-transformer';
import { GeocodeQuery, ReverseQuery } from '../../../src/model';
import { ChainProvider, GoogleMapsProvider, HereProvider, MapQuestProvider } from '../../../src/provider';

chai.use(chaiAsPromised);
chai.should();

describe('ChainProvider (unit)', () => {
    let client: AxiosInstance;
    let chainProvider: ChainProvider;

    beforeEach(() => {
        client = Axios.create();

        chainProvider = new ChainProvider();
    });

    describe('#constructor', () => {
        it('should be instance of ChainProvider', async () => {
            return chainProvider.should.be.instanceOf(ChainProvider);
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return chainProvider.geocode.should.be.instanceOf(Function);
        });

        it('should return empty result array', async () => {
            return chainProvider
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
            return chainProvider.reverse.should.be.instanceOf(Function);
        });

        it('should return empty result array', async () => {
            return chainProvider
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
            return chainProvider.getProviders.should.be.instanceOf(Function);
        });

        it('should return array', async () => {
            return chainProvider.getProviders().should.be.an('array');
        });

        it('should have zero provider', async () => {
            return chainProvider.getProviders().should.have.lengthOf(0);
        });

        it('should have one providers', async () => {
            return new ChainProvider([new HereProvider(client, 'test', 'test')]).getProviders().should.have.lengthOf(1);
        });
    });

    describe('#registerProvider', () => {
        it('should be instance of Function', async () => {
            return chainProvider.registerProvider.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return chainProvider.registerProvider(new GoogleMapsProvider(client, 'test')).should.be.instanceOf(ChainProvider);
        });

        it('should register provider', async () => {
            chainProvider.registerProvider(new GoogleMapsProvider(client, 'test'));

            return chainProvider.getProviders().should.have.lengthOf(1);
        });
    });

    describe('#registerProviders', () => {
        it('should be instance of Function', async () => {
            return chainProvider.registerProviders.should.be.instanceOf(Function);
        });

        it('should return this', async () => {
            return chainProvider.registerProviders([new GoogleMapsProvider(client, 'test')]).should.be.instanceOf(ChainProvider);
        });

        it('should do nothing', async () => {
            chainProvider.registerProviders([]);

            return chainProvider.getProviders().should.have.lengthOf(0);
        });

        it('should register two providers', async () => {
            chainProvider.registerProviders([new GoogleMapsProvider(client, 'test'), new MapQuestProvider(client, 'test')]);

            return chainProvider.getProviders().should.have.lengthOf(2);
        });
    });
});

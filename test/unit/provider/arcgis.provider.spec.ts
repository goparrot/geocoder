import Axios, { AxiosInstance } from 'axios';
import { AccuracyEnum } from '../../../src/model';
import { ArcgisProvider } from '../../../src/provider';

describe('ArcgisProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: ArcgisProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new ArcgisProvider(client);
    });

    describe('#constructor', () => {
        it('should be instance of ArcgisProvider', async () => {
            return provider.should.be.instanceOf(ArcgisProvider);
        });
    });

    describe('#maxAccuracy', () => {
        it('should be typeof AccuracyEnum', async () => {
            return provider.maxAccuracy.should.be.deep.eq(AccuracyEnum.HOUSE_NUMBER);
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return provider.geocode.should.be.instanceOf(Function);
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return provider.reverse.should.be.instanceOf(Function);
        });
    });
});

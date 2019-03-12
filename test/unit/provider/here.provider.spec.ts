import Axios, { AxiosInstance } from 'axios';
import { InvalidCredentialsException } from '../../../src/exception';
import { AccuracyEnum } from '../../../src/model';
import { HereProvider } from '../../../src/provider';

describe('HereProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: HereProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new HereProvider(client, 'test', 'test');
    });

    describe('#constructor', () => {
        it('should be instance of HereProvider', async () => {
            return provider.should.be.instanceOf(HereProvider);
        });

        it('should throw InvalidCredentialsException on empty appId', async () => {
            return ((): any => new HereProvider(client, 'test', '')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
        });

        it('should throw InvalidCredentialsException on empty appCode', async () => {
            return ((): any => new HereProvider(client, '', 'test')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
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

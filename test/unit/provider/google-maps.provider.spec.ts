import Axios, { AxiosInstance } from 'axios';
import { InvalidCredentialsException } from '../../../src/exception';
import { GoogleMapsProvider } from '../../../src/provider';

describe('GoogleMapsProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: GoogleMapsProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new GoogleMapsProvider(client, 'test');
    });

    describe('#constructor', () => {
        it('should be instance of GoogleMapsProvider', async () => {
            return provider.should.be.instanceOf(GoogleMapsProvider);
        });

        it('should throw InvalidCredentialsException on empty appKey', async () => {
            return ((): any => new GoogleMapsProvider(client, '')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
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

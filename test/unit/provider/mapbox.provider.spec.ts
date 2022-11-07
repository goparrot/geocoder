import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { InvalidCredentialsException } from '../../../src/exception';
import { MapboxProvider } from '../../../src/provider';

describe('MapboxProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: MapboxProvider;

    beforeEach(() => {
        client = axios.create();

        provider = new MapboxProvider(client, 'test', 'mapbox.places');
    });

    describe('#constructor', () => {
        it('should be instance of MapboxProvider', async () => {
            return provider.should.be.instanceOf(MapboxProvider);
        });

        it('should throw InvalidCredentialsException on empty appKey', async () => {
            return ((): any => new MapboxProvider(client, '', 'mapbox.places')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
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

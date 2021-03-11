import type { AxiosInstance } from 'axios';
import Axios from 'axios';
import { InvalidCredentialsException } from '../../../src/exception';
import { MapQuestProvider } from '../../../src/provider';

describe('MapQuestProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: MapQuestProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new MapQuestProvider(client, 'test');
    });

    describe('#constructor', () => {
        it('should be instance of MapQuestProvider', async () => {
            return provider.should.be.instanceOf(MapQuestProvider);
        });

        it('should throw InvalidCredentialsException on empty appKey', async () => {
            return ((): any => new MapQuestProvider(client, '')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
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

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return provider.reverse.should.be.instanceOf(Function);
        });
    });
});

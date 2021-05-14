import Axios from 'axios';
import { Geocoder } from '../../../src/geocoder';
import { NullLogger } from '../../../src/logger';
import { HereProvider } from '../../../src/provider';
import type { LoggerInterface } from '../../../src/logger';
import type { AxiosInstance } from 'axios';

describe('Geocoder (unit)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;

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
        client = Axios.create();

        geocoder = new Geocoder(new HereProvider(client, 'test', 'test'));
    });

    describe('#constructor', () => {
        it('should be instance of Geocoder', async () => {
            return geocoder.should.be.instanceOf(Geocoder);
        });
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

    describe('#suggest', () => {
        it('should be instance of Function', async () => {
            return geocoder.suggest.should.be.instanceOf(Function);
        });
    });

    describe('#setLogger', () => {
        it('should be instance of Function', async () => {
            return geocoder.setLogger.should.be.instanceOf(Function);
        });

        it('should return instance of this', async () => {
            return geocoder.setLogger(new CustomLogger()).should.be.instanceOf(Geocoder);
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

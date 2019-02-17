import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Geocoder } from '../../../src/geocoder';
import { HereProvider } from '../../../src/provider';

chai.use(chaiAsPromised);
chai.should();

describe('Geocoder (unit)', () => {
    let client: AxiosInstance;
    let geocoder: Geocoder;

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
});

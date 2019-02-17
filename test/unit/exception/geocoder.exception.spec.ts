import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { GeocoderException } from '../../../src/exception';

chai.use(chaiAsPromised);
chai.should();

describe('GeocoderException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit Error', async () => {
            return new GeocoderException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new GeocoderException('').should.have.property('name', GeocoderException.name);
        });

        it('should return right message', async () => {
            return new GeocoderException('test').should.have.property('message', 'test');
        });
    });

    describe('#getPayload', () => {
        it('should return undefined', async () => {
            return (typeof new GeocoderException('').getPayload()).should.be.eq('undefined');
        });

        it('should return array', async () => {
            return new GeocoderException('', []).getPayload().should.be.an('array');
        });

        it('should return empty array', async () => {
            return new GeocoderException('', []).getPayload().should.have.lengthOf(0);
        });

        it('should return object', async () => {
            return new GeocoderException('', { a: 1 }).getPayload().should.have.property('a', 1);
        });
    });
});

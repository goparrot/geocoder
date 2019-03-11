import { GeocoderException, UnsupportedAccuracyException } from '../../../src/exception';

describe('UnsupportedAccuracyException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new UnsupportedAccuracyException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new UnsupportedAccuracyException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new UnsupportedAccuracyException('').should.have.property('name', UnsupportedAccuracyException.name);
        });

        it('should return right message', async () => {
            return new UnsupportedAccuracyException('test').should.have.property('message', 'test');
        });
    });
});

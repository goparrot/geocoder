import { GeocoderException, UnsupportedOperationException } from '../../../src/exception';

describe('UnsupportedOperationException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new UnsupportedOperationException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new UnsupportedOperationException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new UnsupportedOperationException('').should.have.property('name', UnsupportedOperationException.name);
        });

        it('should return right message', async () => {
            return new UnsupportedOperationException('test').should.have.property('message', 'test');
        });
    });
});

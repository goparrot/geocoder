import { GeocoderException, InvalidArgumentException } from '../../../src/exception';

describe('InvalidArgumentException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new InvalidArgumentException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new InvalidArgumentException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new InvalidArgumentException('').should.have.property('name', InvalidArgumentException.name);
        });

        it('should return right message', async () => {
            return new InvalidArgumentException('test').should.have.property('message', 'test');
        });
    });
});

import { GeocoderException, InvalidServerResponseException } from '../../../src/exception';

describe('InvalidServerResponseException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new InvalidServerResponseException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new InvalidServerResponseException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new InvalidServerResponseException('').should.have.property('name', InvalidServerResponseException.name);
        });

        it('should return right message', async () => {
            return new InvalidServerResponseException('test').should.have.property('message', 'test');
        });
    });
});

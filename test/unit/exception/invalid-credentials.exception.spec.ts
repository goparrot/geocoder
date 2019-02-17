import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { GeocoderException, InvalidCredentialsException } from '../../../src/exception';

chai.use(chaiAsPromised);
chai.should();

describe('InvalidCredentialsException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new InvalidCredentialsException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new InvalidCredentialsException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new InvalidCredentialsException('').should.have.property('name', InvalidCredentialsException.name);
        });

        it('should return right message', async () => {
            return new InvalidCredentialsException('test').should.have.property('message', 'test');
        });
    });
});

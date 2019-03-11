import { ValidationError } from 'class-validator';
import { GeocoderException, ValidationException } from '../../../src/exception';

describe('ValidationException (unit)', () => {
    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            return new ValidationException([]).should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new ValidationException([]).should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new ValidationException([]).should.have.property('name', ValidationException.name);
        });

        it('should return right message', async () => {
            return new ValidationException([]).should.have.property('message', 'Validation Failed.');
        });
    });

    describe('#getValidationErrors', () => {
        it('should return array', async () => {
            const exception: ValidationException = new ValidationException([]);

            return exception.getValidationErrors().should.be.an('array');
        });

        it('should return empty array', async () => {
            const exception: ValidationException = new ValidationException([]);

            return exception.getValidationErrors().should.have.length(0);
        });

        it('should return array of ValidationError', async () => {
            const exception: ValidationException = new ValidationException([new ValidationError()]);

            return exception.getValidationErrors().should.have.length(1);
        });
    });
});

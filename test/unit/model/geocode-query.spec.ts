import { plainToClass } from 'class-transformer';
import { ValidationError, Validator } from 'class-validator';
import { AccuracyEnum, GeocodeQuery } from '../../../src/model';

describe('GeocodeQuery (unit)', () => {
    describe('#validation', () => {
        const validator: Validator = new Validator();

        it('should throw error with IsExactMatchApplicable with AccuracyEnum.STREET_NAME and limit 1', async () => {
            const query: GeocodeQuery = plainToClass(GeocodeQuery, {
                exactMatch: true,
                accuracy: AccuracyEnum.STREET_NAME,
                address: 'test123',
                limit: 1,
            });

            const errors: ValidationError[] = await validator.validate(query);

            errors.length.should.be.equal(1);
            errors[0].constraints.should.be.eql({
                isExactMatchApplicable:
                    'Can be used only if accuracy is not specified or it is set to AccuracyEnum.HOUSE_NUMBER and if limit is not specified or it is more than 1',
            });
        });

        it('should throw error with IsExactMatchApplicable with limit 1', async () => {
            const query: GeocodeQuery = plainToClass(GeocodeQuery, {
                exactMatch: true,
                accuracy: AccuracyEnum.HOUSE_NUMBER,
                address: 'test123',
                limit: 1,
            });

            const errors: ValidationError[] = await validator.validate(query);

            errors.length.should.be.equal(1);
            errors[0].constraints.should.be.eql({
                isExactMatchApplicable:
                    'Can be used only if accuracy is not specified or it is set to AccuracyEnum.HOUSE_NUMBER and if limit is not specified or it is more than 1',
            });
        });

        it('should be ok', async () => {
            const query: GeocodeQuery = plainToClass(GeocodeQuery, {
                exactMatch: true,
                address: 'test123',
            });

            const errors: ValidationError[] = await validator.validate(query);

            return errors.should.be.deep.eq([]);
        });
    });
});

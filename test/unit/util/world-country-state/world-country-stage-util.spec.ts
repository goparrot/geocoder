import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ValidationException } from '../../../../src/exception';
import { WorldCountryState, WorldCountryStateUtil } from '../../../../src/util/world-country-state';

chai.use(chaiAsPromised);
chai.should();

describe('WorldCountryStateUtil (unit)', () => {
    const worldCountryStateFixture: WorldCountryState = {
        countryCode: 'US',
        stateCode: 'NY',
        name: 'New York',
    };

    describe('#find', () => {
        it('should find state by name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                name: 'New York',
            }).should.become(worldCountryStateFixture);
        });

        it('should find state by countryCode', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'NY',
            }).should.become(worldCountryStateFixture);
        });

        it('should not find state by valid countryCode and wrong state name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                name: 'Wrong state name',
            }).should.become(undefined);
        });

        it('should not find state by valid countryCode and wrong stateCode', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'XX',
            }).should.become(undefined);
        });

        it('should not find state by valid countryCode and stateCode but wrong state name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'NY',
                name: 'Wrong state name',
            }).should.become(undefined);
        });

        it('should throw ValidationException if the stateCode format is invalid', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'TOO_LONG',
            }).should.be.rejectedWith(ValidationException);
        });

        it('should throw ValidationException if the countryCode format is invalid', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'TOO_LONG',
                stateCode: 'NY',
            }).should.be.rejectedWith(ValidationException);
        });
    });
});

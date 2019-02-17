import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
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

        it('should find state by valid countryCode and stateCode and wrong state name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'NY',
                name: 'Wrong state name',
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
    });
});

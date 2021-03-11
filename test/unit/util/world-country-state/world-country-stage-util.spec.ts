import type { WorldCountryState } from '../../../../src/util/world-country-state';
import { WorldCountryStateUtil } from '../../../../src/util/world-country-state';

describe('WorldCountryStateUtil (unit)', () => {
    const worldCountryStateFixture: WorldCountryState = {
        countryCode: 'US',
        stateCode: 'MD',
        name: 'Maryland',
    };

    describe('#find', () => {
        it('should find state by name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                name: 'Maryland',
            }).should.become(worldCountryStateFixture);
        });

        it('should find state by countryCode', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'MD',
            }).should.become(worldCountryStateFixture);
        });

        it('should find state by valid countryCode and stateCode and wrong state name', async () => {
            return WorldCountryStateUtil.find({
                countryCode: 'US',
                stateCode: 'MD',
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

import { WorldCountry, WorldCountryUtil } from '../../../../src/util/world-country';

describe('WorldCountryUtil (unit)', () => {
    const successResponseFixture: WorldCountry = {
        cca2: 'US',
        cca3: 'USA',
        ccn3: '840',
        name: {
            common: 'United States',
            official: 'United States of America',
        },
    };

    describe('#find', () => {
        it('should find country by name', async () => {
            return WorldCountryUtil.find({
                name: 'United States',
            }).should.become(successResponseFixture);
        });

        it('should find country by cca2', async () => {
            return WorldCountryUtil.find({
                cca2: 'US',
            }).should.become(successResponseFixture);
        });

        it('should find country by cca3', async () => {
            return WorldCountryUtil.find({
                cca3: 'USA',
            }).should.become(successResponseFixture);
        });

        it('should find country by cca2 and wrong name', async () => {
            return WorldCountryUtil.find({
                name: 'Wrong country name',
                cca2: 'US',
            }).should.become(successResponseFixture);
        });

        it('should not find country', async () => {
            return WorldCountryUtil.find({
                name: 'Wrong country name',
            }).should.become(undefined);
        });
    });
});

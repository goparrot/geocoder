import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { sliceFrom } from '../../../src/util';

chai.use(chaiAsPromised);
chai.should();

describe('util (unit)', () => {
    describe('#sliceFrom', () => {
        const fixture: ReadonlyArray<string> = Object.freeze(['COUNTRY', 'STATE', 'COUNTY', 'CITY', 'NEIGHBORHOOD', 'STREET', 'ADDRESS', 'POINT']);

        it('should return all elements', async () => {
            return sliceFrom(Object.values(fixture), 'COUNTRY').should.be.deep.eq(fixture);
        });

        it('should return array with last element', async () => {
            return sliceFrom(Object.values(fixture), 'POINT').should.be.deep.eq(['POINT']);
        });

        it('should return array with 3 last elements', async () => {
            return sliceFrom(Object.values(fixture), 'STREET').should.be.deep.eq(['STREET', 'ADDRESS', 'POINT']);
        });

        it('should return nothing', async () => {
            return sliceFrom(Object.values(fixture), 'WRONG_VALUE').should.be.deep.eq([]);
        });
    });
});

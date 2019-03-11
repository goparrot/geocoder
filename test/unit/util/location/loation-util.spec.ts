import { InvalidArgumentException } from '../../../../src/exception';
import { LocationUtil } from '../../../../src/util';

describe('LocationUtil (unit)', () => {
    describe('#removeHouseNumberFromStreetName', () => {
        it('should cut the house number from the beginning of the street name', async () => {
            return LocationUtil.removeHouseNumberFromStreetName('123 Street 123 Name', '123').should.eq('Street 123 Name');
        });

        it('should cut the house number from the end of the street name', async () => {
            return LocationUtil.removeHouseNumberFromStreetName('Street 123 Name 123', '123').should.eq('Street 123 Name');
        });

        it('should not change street name', async () => {
            return LocationUtil.removeHouseNumberFromStreetName('Street 123 Name', '123').should.eq('Street 123 Name');
        });

        it('should throw InvalidArgumentException if house number is empty', async () => {
            return ((): any => LocationUtil.removeHouseNumberFromStreetName('Street 123 Name', '')).should.throw(InvalidArgumentException, 'Argument values must not be empty');
        });

        it('should throw InvalidArgumentException if street name is empty', async () => {
            return ((): any => LocationUtil.removeHouseNumberFromStreetName('', '123')).should.throw(InvalidArgumentException, 'Argument values must not be empty')
        });
    });
});

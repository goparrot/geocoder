import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { classToPlain, plainToClass } from 'class-transformer';
import { LocationInterface } from '../../../src/interface';
import { Location } from '../../../src/model';
import { plainFullFilledLocationObject } from '../../fixture/model/address.fixture';

chai.use(chaiAsPromised);
chai.should();

describe('Location (unit)', () => {
    let plainFullFilledLocationFixture: LocationInterface;
    let locationModelFixture: Location;

    beforeEach(() => {
        plainFullFilledLocationFixture = plainFullFilledLocationObject;

        locationModelFixture = plainToClass<Location, LocationInterface>(Location, plainFullFilledLocationFixture);
    });

    describe('#constructor', () => {
        it('should be instance of Location with empty data', async () => {
            new Location().should.be.instanceOf(Location);
        });
    });

    describe('#street', () => {
        it('should generate valid street', async () => {
            locationModelFixture.street.should.eq('1158 E 89th St');
        });
    });

    describe('#toObject', () => {
        it('should generate valid object', async () => {
            return locationModelFixture.toObject().should.be.deep.eq(plainFullFilledLocationFixture);
        });
    });

    describe('#generateFormattedAddress', () => {
        it('should return empty value', async () => {
            const locationModel: Location = new Location();

            return locationModel.generateFormattedAddress().should.eq('');
        });

        it('should return valid formattedAddress if formattedAddress, stateCode and country are empty', async () => {
            delete locationModelFixture.formattedAddress;
            delete locationModelFixture.stateCode;
            delete locationModelFixture.country;

            return locationModelFixture.generateFormattedAddress().should.be.deep.eq('1158 E 89th St, Chicago, Illinois 60619, US');
        });

        it('should return valid formattedAddress if formattedAddress, postalCode and country are empty', async () => {
            delete locationModelFixture.formattedAddress;
            delete locationModelFixture.postalCode;
            delete locationModelFixture.country;

            return locationModelFixture.generateFormattedAddress().should.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });
    });

    describe('spread operator', () => {
        it('should generate the same result as plain object', async () => {
            return { ...locationModelFixture }.should.be.deep.eq(plainFullFilledLocationFixture);
        });

        it('should generate the same result as #toObject', async () => {
            return { ...locationModelFixture }.should.be.deep.eq(locationModelFixture.toObject());
        });
    });

    describe('classToPlain', () => {
        it('should use #generateFormattedAddress if formattedAddress is empty', async () => {
            delete locationModelFixture.formattedAddress;
            delete locationModelFixture.postalCode;
            delete locationModelFixture.country;

            const addressPlainObject: LocationInterface = classToPlain<Location>(locationModelFixture) as LocationInterface;

            return (addressPlainObject.formattedAddress as string).should.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });

        it('should not generate street property', async () => {
            const addressPlainObject: any = classToPlain<Location>(locationModelFixture) as LocationInterface;

            return (typeof addressPlainObject.street).should.be.eq('undefined');
        });
    });

    describe('plainToClass', () => {
        it('should ignore unsupported properties', async () => {
            const locationModel: Location = plainToClass<Location, LocationInterface>(
                Location,
                // @ts-ignore
                {
                    ...plainFullFilledLocationFixture,
                    ...{
                        unsupported: true,
                    },
                },
            );

            locationModel.should.be.instanceOf(Location);
            return locationModel.should.be.deep.eq(locationModelFixture);
        });
    });
});

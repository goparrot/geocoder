import { classToPlain, plainToClass } from 'class-transformer';
import { Location } from '../../../src/model';
import { locationFixture } from '../../fixture/model/address.fixture';
import type { LocationInterface } from '../../../src/interface';

describe('Location (unit)', () => {
    let location: Location;

    beforeEach(() => {
        location = plainToClass<Location, LocationInterface>(Location, locationFixture, {
            groups: ['raw'],
        });
    });

    describe('#constructor', () => {
        it('should be instance of Location with empty data', async () => {
            new Location().should.be.instanceOf(Location);
        });
    });

    describe('#street', () => {
        it('should generate valid street', async () => {
            location.street.should.eq('1158 E 89th St');
        });
    });

    describe('#toObject', () => {
        it('should generate valid object', async () => {
            return location
                .toObject({
                    groups: ['raw'],
                })
                .should.be.deep.eq(locationFixture);
        });
    });

    describe('#generateFormattedAddress', () => {
        it('should return empty value', async () => {
            const locationModel: Location = new Location();

            return locationModel.generateFormattedAddress().should.eq('');
        });

        it('should return valid formattedAddress if formattedAddress, stateCode and country are empty', async () => {
            delete location.formattedAddress;
            delete location.stateCode;
            delete location.country;

            return location.generateFormattedAddress().should.be.deep.eq('1158 E 89th St, Chicago, Illinois 60619, US');
        });

        it('should return valid formattedAddress if formattedAddress, postalCode and country are empty', async () => {
            delete location.formattedAddress;
            delete location.postalCode;
            delete location.country;

            return location.generateFormattedAddress().should.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });
    });

    describe('spread operator', () => {
        it('should generate the same result as plain object', async () => {
            return { ...location }.should.be.deep.eq(locationFixture);
        });

        it('should generate the same result as #toObject', async () => {
            return { ...location }.should.be.deep.eq(
                location.toObject({
                    groups: ['raw'],
                }),
            );
        });
    });

    describe('classToPlain', () => {
        it('should use #generateFormattedAddress if formattedAddress is empty', async () => {
            delete location.formattedAddress;
            delete location.postalCode;
            delete location.country;

            const addressPlainObject: LocationInterface = classToPlain<Location>(location) as LocationInterface;

            return (addressPlainObject.formattedAddress as string).should.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });

        it('should not generate street property', async () => {
            const addressPlainObject: any = classToPlain<Location>(location) as LocationInterface;

            return (typeof addressPlainObject.street).should.be.eq('undefined');
        });
    });

    describe('plainToClass', () => {
        it('should ignore unsupported properties', async () => {
            const locationModel: Location = plainToClass<Location, LocationInterface>(
                Location,
                // @ts-ignore
                {
                    ...locationFixture,
                    ...{
                        unsupported: true,
                    },
                },
                {
                    groups: ['raw'],
                },
            );

            locationModel.should.be.instanceOf(Location);
            return locationModel.should.be.deep.eq(location);
        });
    });
});

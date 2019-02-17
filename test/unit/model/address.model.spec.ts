import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { classToPlain, plainToClass } from 'class-transformer';
import { AddressInterface } from '../../../src/interface';
import { Address } from '../../../src/model';
import { plainFullFilledAddressObject } from '../../fixture/model/address.fixture';

chai.use(chaiAsPromised);
chai.should();
const expect: Chai.ExpectStatic = chai.expect;

describe('Address (unit)', () => {
    let plainFullFilledAddressFixture: AddressInterface;
    let addressModelFixture: Address;

    beforeEach(() => {
        plainFullFilledAddressFixture = plainFullFilledAddressObject;

        addressModelFixture = plainToClass<Address, AddressInterface>(Address, plainFullFilledAddressFixture);
    });

    describe('#constructor', () => {
        it('should be instance of Address with empty data', async () => {
            new Address().should.be.instanceOf(Address);
        });
    });

    describe('#street', () => {
        it('should generate valid street', async () => {
            addressModelFixture.street.should.eq('1158 E 89th St');
        });
    });

    describe('#getFormattedAddress', () => {
        it('should return empty formattedAddress', async () => {
            const addressModel: Address = new Address();

            expect(addressModel.formattedAddress).to.be.eq(undefined);
            return addressModel.getFormattedAddress().should.eq('');
        });

        it('should return formattedAddress property value', async () => {
            return expect(addressModelFixture.formattedAddress).to.be.deep.eq('1158 E 89th St, Chicago, IL 60619, United States');
        });

        it('should return valid formattedAddress if formattedAddress, stateCode and country are empty', async () => {
            delete addressModelFixture.formattedAddress;
            delete addressModelFixture.stateCode;
            delete addressModelFixture.country;

            expect(addressModelFixture.formattedAddress).to.be.deep.eq(undefined);
            return expect(addressModelFixture.getFormattedAddress()).to.be.deep.eq('1158 E 89th St, Chicago, Illinois 60619, US');
        });

        it('should return valid formattedAddress if formattedAddress, postalCode and country are empty', async () => {
            delete addressModelFixture.formattedAddress;
            delete addressModelFixture.postalCode;
            delete addressModelFixture.country;

            expect(addressModelFixture.formattedAddress).to.be.deep.eq(undefined);
            return expect(addressModelFixture.getFormattedAddress()).to.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });
    });

    describe('#toObject', () => {
        it('should generate valid object', async () => {
            return expect(addressModelFixture.toObject()).to.be.deep.eq(plainFullFilledAddressFixture);
        });
    });

    describe('spread operator', () => {
        it('should generate the same result as #toObject', async () => {
            expect({ ...addressModelFixture }).to.be.deep.eq(plainFullFilledAddressFixture);
            return expect({ ...addressModelFixture }).to.be.deep.eq(addressModelFixture.toObject());
        });
    });

    describe('classToPlain', () => {
        it('should use #getFormattedAddress if formattedAddress is empty', async () => {
            delete addressModelFixture.formattedAddress;
            delete addressModelFixture.postalCode;
            delete addressModelFixture.country;

            const addressPlainObject: AddressInterface = classToPlain<Address>(addressModelFixture) as AddressInterface;

            expect(addressPlainObject).to.be.instanceOf(Object);
            return expect(addressPlainObject.formattedAddress).to.be.deep.eq('1158 E 89th St, Chicago, IL, US');
        });

        it('should not generate street property', async () => {
            const addressPlainObject: any = classToPlain<Address>(addressModelFixture) as AddressInterface;

            return expect(addressPlainObject.street).to.be.undefined;
        });
    });

    describe('plainToClass', () => {
        it('should ignore unsupported properties', async () => {
            const addressModel: Address = plainToClass<Address, AddressInterface>(
                Address,
                // @ts-ignore
                {
                    ...plainFullFilledAddressFixture,
                    ...{
                        unsupported: true,
                    },
                },
            );

            addressModel.should.be.instanceOf(Address);
            return addressModel.should.be.deep.eq(addressModelFixture);
        });
    });
});

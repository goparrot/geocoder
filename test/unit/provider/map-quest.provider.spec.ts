import Axios, { AxiosInstance } from 'axios';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { InvalidCredentialsException, UnsupportedAccuracyException } from '../../../src/exception';
import { AccuracyEnum } from '../../../src/model';
import { MapQuestProvider } from '../../../src/provider';

chai.use(chaiAsPromised);
chai.should();

describe('MapQuestProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: MapQuestProvider;

    beforeEach(() => {
        client = Axios.create();

        provider = new MapQuestProvider(client, 'test');
    });

    describe('#constructor', () => {
        it('should be instance of MapQuestProvider', async () => {
            return provider.should.be.instanceOf(MapQuestProvider);
        });

        it('should throw InvalidCredentialsException on empty appKey', async () => {
            return ((): any => new MapQuestProvider(client, '')).should.throw(InvalidCredentialsException, 'Invalid or missing api key.');
        });
    });

    describe('#maxAccuracy', () => {
        it('should be typeof AccuracyEnum', async () => {
            return provider.maxAccuracy.should.be.deep.eq(AccuracyEnum.STREET_NAME);
        });
    });

    describe('#geocode', () => {
        it('should be instance of Function', async () => {
            return provider.geocode.should.be.instanceOf(Function);
        });
    });

    describe('#reverse', () => {
        it('should be instance of Function', async () => {
            return provider.reverse.should.be.instanceOf(Function);
        });
    });

    describe('#accuracyFilter', () => {
        const fixture: any = {
            street: '',
            adminArea6: '',
            adminArea6Type: 'Neighborhood',
            adminArea5: 'Illinois Park',
            adminArea5Type: 'City',
            adminArea4: 'Kane County',
            adminArea4Type: 'County',
            adminArea3: 'IL',
            adminArea3Type: 'State',
            adminArea1: 'US',
            adminArea1Type: 'Country',
            postalCode: '',
            geocodeQualityCode: 'A5XAX',
            geocodeQuality: 'CITY',
            dragPoint: false,
            sideOfStreet: 'N',
            linkId: '283481676',
            unknownInput: '',
            type: 's',
            latLng: {
                lat: 42.048082,
                lng: -88.314246,
            },
            displayLatLng: {
                lat: 42.048082,
                lng: -88.314246,
            },
        };

        it('should return true if the accuracy value is not specified', async () => {
            return provider.accuracyFilter(fixture).should.be.eq(true);
        });

        it('should return false for AccuracyEnum.COUNTRY', async () => {
            return provider.accuracyFilter(fixture, AccuracyEnum.COUNTRY).should.be.eq(true);
        });

        it('should return false for AccuracyEnum.STATE', async () => {
            return provider.accuracyFilter(fixture, AccuracyEnum.STATE).should.be.eq(true);
        });

        it('should return false for AccuracyEnum.CITY', async () => {
            return provider.accuracyFilter(fixture, AccuracyEnum.CITY).should.be.eq(true);
        });

        it('should return false for AccuracyEnum.STREET_NAME', async () => {
            return provider.accuracyFilter(fixture, AccuracyEnum.STREET_NAME).should.be.eq(false);
        });

        it('should return false for AccuracyEnum.HOUSE_NUMBER', async () => {
            return provider.accuracyFilter(fixture, AccuracyEnum.HOUSE_NUMBER).should.be.eq(false);
        });

        it('should throw UnsupportedAccuracyException for unsupported accuracy value', async () => {
            const accuracy: AccuracyEnum = 'WRONG_VALUE' as AccuracyEnum;

            return ((): any => provider.accuracyFilter(fixture, accuracy as AccuracyEnum)).should.throw(
                UnsupportedAccuracyException,
                `Unsupported "${accuracy}" accuracy.`,
            );
        });
    });
});

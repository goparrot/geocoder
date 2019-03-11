import Axios, { AxiosInstance } from 'axios';
import { plainToClass } from 'class-transformer';
import { ReverseQueryInterface } from '../../../src/interface';
import { AccuracyEnum, ReverseQuery } from '../../../src/model';
import { ArcgisProvider } from '../../../src/provider';
import { reverseQueryFixture } from '../../fixture/model/query.fixture';

describe('ArcgisProvider (unit)', () => {
    let client: AxiosInstance;
    let provider: ArcgisProvider;
    let reverseQuery: ReverseQueryInterface;

    beforeEach(() => {
        client = Axios.create();

        provider = new ArcgisProvider(client);

        reverseQuery = { ...reverseQueryFixture };
    });

    describe('#constructor', () => {
        it('should be instance of ArcgisProvider', async () => {
            return provider.should.be.instanceOf(ArcgisProvider);
        });
    });

    describe('#maxAccuracy', () => {
        it('should be typeof AccuracyEnum', async () => {
            return provider.maxAccuracy.should.be.deep.eq(AccuracyEnum.HOUSE_NUMBER);
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

    describe('#buildReverseQuery', () => {
        it('should return false for AccuracyEnum.COUNTRY', async () => {
            reverseQuery.accuracy = AccuracyEnum.COUNTRY;

            return provider.buildReverseQuery(plainToClass(ReverseQuery, reverseQuery)).should.eventually.have.property('featureTypes', 'PointAddress,StreetAddress,Locality');
        });

        it('should return false for AccuracyEnum.STATE', async () => {
            reverseQuery.accuracy = AccuracyEnum.STATE;

            return provider.buildReverseQuery(plainToClass(ReverseQuery, reverseQuery)).should.eventually.have.property('featureTypes', 'PointAddress,StreetAddress,Locality');
        });

        it('should return false for AccuracyEnum.CITY', async () => {
            reverseQuery.accuracy = AccuracyEnum.CITY;

            return provider.buildReverseQuery(plainToClass(ReverseQuery, reverseQuery)).should.eventually.have.property('featureTypes', 'PointAddress,StreetAddress,Locality');
        });

        it('should return false for AccuracyEnum.STREET_NAME', async () => {
            reverseQuery.accuracy = AccuracyEnum.STREET_NAME;

            return provider.buildReverseQuery(plainToClass(ReverseQuery, reverseQuery)).should.eventually.have.property('featureTypes', 'PointAddress,StreetAddress');
        });

        it('should return false for AccuracyEnum.HOUSE_NUMBER', async () => {
            reverseQuery.accuracy = AccuracyEnum.HOUSE_NUMBER;

            return provider.buildReverseQuery(plainToClass(ReverseQuery, reverseQuery)).should.eventually.have.property('featureTypes', 'PointAddress');
        });
    });
});

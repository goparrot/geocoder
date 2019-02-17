import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { NullLogger } from '../../../src/logger';

chai.use(chaiAsPromised);
chai.should();

describe('NullLogger (unit)', () => {
    let logger: NullLogger;

    beforeEach(() => {
        logger = new NullLogger();
    });

    describe('#constructor', () => {
        it('should be instance of NullLogger', async () => {
            return logger.should.be.instanceOf(NullLogger);
        });
    });

    describe('#debug', () => {
        it('should be instance of Function', async () => {
            return logger.debug.should.be.instanceOf(Function);
        });

        it('should do nothing', async () => {
            return (typeof logger.debug()).should.be.eq('undefined');
        });
    });

    describe('#info', () => {
        it('should be instance of Function', async () => {
            return logger.info.should.be.instanceOf(Function);
        });

        it('should do nothing', async () => {
            return (typeof logger.info()).should.be.eq('undefined');
        });
    });

    describe('#warn', () => {
        it('should be instance of Function', async () => {
            return logger.warn.should.be.instanceOf(Function);
        });

        it('should do nothing', async () => {
            return (typeof logger.warn()).should.be.eq('undefined');
        });
    });

    describe('#error', () => {
        it('should be instance of Function', async () => {
            return logger.error.should.be.instanceOf(Function);
        });

        it('should do nothing', async () => {
            return (typeof logger.error()).should.be.eq('undefined');
        });
    });
});

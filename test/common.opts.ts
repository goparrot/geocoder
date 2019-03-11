import * as chai from 'chai';
// @ts-ignore
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
// @ts-ignore
global.should = chai.should();

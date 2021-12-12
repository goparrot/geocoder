import { ChainProvider } from '../../../src/provider';
import { sharedProvidableBehaviours } from '../../e2e/common/shared';

describe('ChainProvider (unit)', () => {
    sharedProvidableBehaviours(ChainProvider);
});

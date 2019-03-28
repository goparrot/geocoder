import { StatefulChainProvider } from '../../../src/provider';
import { sharedProvidableBehaviours } from '../../e2e/common/shared';

describe('StatefulChainProvider (unit)', () => {
    sharedProvidableBehaviours(StatefulChainProvider as any);
});

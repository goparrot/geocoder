import Axios from 'axios';
import type { AxiosInstance } from 'axios';
import { StatefulDecider } from '../../../src/decider';
import { ProviderNotRegisteredException } from '../../../src/exception';
import { GoogleMapsProvider, HereProvider } from '../../../src/provider';

describe('StatefulDecider (unit)', () => {
    let decider: StatefulDecider;
    let mapQuestProvider: HereProvider;
    let googleProvider: GoogleMapsProvider;

    beforeEach(() => {
        decider = new StatefulDecider();

        const client: AxiosInstance = Axios.create();

        mapQuestProvider = new HereProvider(client, 'test', 'test');
        googleProvider = new GoogleMapsProvider(client, 'test');
    });

    describe('#getProvider', () => {
        it('should throw ProviderNotRegisteredException', async () => {
            return decider.getProvider([]).should.be.rejectedWith(ProviderNotRegisteredException, 'No provider registered.');
        });

        it('should use forced provider', async () => {
            return decider.getProvider([googleProvider, mapQuestProvider], googleProvider).should.become(googleProvider);
        });

        it('should use first provider by default', async () => {
            return decider.getProvider([googleProvider, mapQuestProvider]).should.become(googleProvider);
        });

        it('should use second provider', async () => {
            await decider.getProvider([googleProvider, mapQuestProvider]);
            return decider.getProvider([googleProvider, mapQuestProvider]).should.become(mapQuestProvider);
        });

        it('should use first provider by circular logic', async () => {
            await decider.getProvider([googleProvider, mapQuestProvider]);
            await decider.getProvider([googleProvider, mapQuestProvider]);
            return decider.getProvider([googleProvider, mapQuestProvider]).should.become(googleProvider);
        });
    });
});

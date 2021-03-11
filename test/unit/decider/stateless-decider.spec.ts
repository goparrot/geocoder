import type { AxiosInstance } from 'axios';
import Axios from 'axios';
import { StatelessDecider } from '../../../src/decider';
import { ProviderNotRegisteredException } from '../../../src/exception';
import { GoogleMapsProvider, HereProvider } from '../../../src/provider';

describe('StatelessDecider (unit)', () => {
    let decider: StatelessDecider;
    let mapQuestProvider: HereProvider;
    let googleProvider: GoogleMapsProvider;

    beforeEach(() => {
        decider = new StatelessDecider();

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

        it('should always use first provider by default', async () => {
            await decider.getProvider([googleProvider, mapQuestProvider]);
            return decider.getProvider([googleProvider, mapQuestProvider]).should.become(googleProvider);
        });
    });
});

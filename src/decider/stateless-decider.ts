import { ProviderNotRegisteredException } from '../exception';
import type { AbstractProvider } from '../model';
import { AbstractDecider } from './abstract-decider';

export class StatelessDecider extends AbstractDecider {
    async getProvider(providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider> {
        if (forceProvider) {
            return forceProvider;
        }

        if (!providers.length) {
            throw ProviderNotRegisteredException.noProviderRegistered();
        }

        // Take first
        return providers[0];
    }
}

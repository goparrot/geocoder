import { ProviderNotRegisteredException } from '../exception';
import { AbstractDecider } from './abstract-decider';
import type { AbstractProvider } from '../model';

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

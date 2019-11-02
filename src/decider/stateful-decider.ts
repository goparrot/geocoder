import { ProviderNotRegisteredException } from '../exception';
import { AbstractProvider } from '../model';
import { AbstractDecider } from './abstract-decider';

export class StatefulDecider extends AbstractDecider {
    private currentProvider?: AbstractProvider;

    async getProvider(providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider> {
        if (forceProvider) {
            return (this.currentProvider = forceProvider);
        }

        if (!providers.length) {
            throw ProviderNotRegisteredException.noProviderRegistered();
        }

        if (!this.currentProvider || 1 === providers.length) {
            return (this.currentProvider = providers[0]);
        }

        return (this.currentProvider = this.getNextProvider(providers, this.currentProvider));
    }

    private getNextProvider(providers: AbstractProvider[], provider: AbstractProvider): AbstractProvider {
        const providerIndex: number = providers.indexOf(provider);

        return providers[providerIndex + 1] || providers[0];
    }
}

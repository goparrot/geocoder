import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { AbstractProvider } from '../model';
import { AbstractDecider } from './abstract-decider';

export class CircularDecider extends AbstractDecider {
    private currentProvider: AbstractProvider | undefined;

    async geocode(_query: GeocodeQueryInterface, providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider> {
        return this.decide(providers, forceProvider);
    }

    async reverse(_query: ReverseQueryInterface, providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider> {
        return this.decide(providers, forceProvider);
    }

    private decide(providers: AbstractProvider[], forceProvider?: AbstractProvider): AbstractProvider {
        if (forceProvider) {
            return (this.currentProvider = forceProvider);
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

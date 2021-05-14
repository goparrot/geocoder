import { ValidationException } from '../exception';
import { AbstractChainProvider } from '../model';
import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import type { AbstractHttpProvider, AbstractProvider, Location, Suggestion } from '../model';

export class StatefulChainProvider extends AbstractChainProvider {
    private nextProvider: AbstractProvider;

    constructor(providers: AbstractHttpProvider[]) {
        super(providers);

        this.setNextProvider();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        for (const provider of this.getOrderedProvidersList()) {
            try {
                this.setNextProvider();

                const locations: Location[] = await provider.geocode(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        for (const provider of this.getOrderedProvidersList()) {
            try {
                this.setNextProvider();

                const locations: Location[] = await provider.reverse(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        for (const provider of this.getOrderedProvidersList()) {
            try {
                this.setNextProvider();

                return await provider.suggest(query);
            } catch (err) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }

    private setNextProvider(): this {
        const providers: AbstractProvider[] = this.getProviders();

        if (!this.nextProvider) {
            this.nextProvider = this.getFirstProvider();
        } else {
            const currentProviderIndex: number = providers.indexOf(this.nextProvider);
            this.nextProvider = providers[currentProviderIndex + 1] || this.getFirstProvider();
        }

        return this;
    }

    /**
     * The round robin queue of providers
     */
    private getOrderedProvidersList(): AbstractProvider[] {
        const providers: AbstractProvider[] = this.getProviders();

        const nextProviderIndex: number = providers.indexOf(this.nextProvider);

        return providers.slice(nextProviderIndex).concat(providers.slice(0, nextProviderIndex));
    }
}

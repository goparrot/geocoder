import { InvalidArgumentException } from '../exception';
import { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractHttpProvider, AbstractProvider, Location, Suggestion } from '../model';

export class StatefulChainProvider extends AbstractProvider {
    private nextProvider: AbstractHttpProvider;
    private readonly providers: AbstractHttpProvider[] = [];

    constructor(providers: AbstractHttpProvider[]) {
        super();

        if (!providers.length) {
            throw new InvalidArgumentException('array of providers should not be empty');
        }

        this.registerProviders(providers);

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
                this.getLogger().error(err);
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
                this.getLogger().error(err);
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
                this.getLogger().error(err);
            }
        }

        return [];
    }

    getProviders(): AbstractHttpProvider[] {
        return this.providers;
    }

    registerProvider(provider: AbstractHttpProvider): this {
        this.providers.push(provider);

        return this;
    }

    registerProviders(providers: AbstractHttpProvider[]): this {
        for (const provider of providers) {
            this.registerProvider(provider);
        }

        return this;
    }

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        for (const provider of this.getProviders()) {
            provider.setLogger(logger);
        }

        return this;
    }

    private setNextProvider(): this {
        if (!this.nextProvider) {
            this.nextProvider = this.providers[0];
        } else {
            const currentProviderIndex: number = this.providers.indexOf(this.nextProvider);
            this.nextProvider = this.providers[currentProviderIndex + 1] || this.providers[0];
        }

        return this;
    }

    /**
     * The round robin queue of providers
     */
    private getOrderedProvidersList(): AbstractHttpProvider[] {
        const nextProviderIndex: number = this.providers.indexOf(this.nextProvider);

        return this.getProviders()
            .slice(nextProviderIndex)
            .concat(this.getProviders().slice(0, nextProviderIndex));
    }
}

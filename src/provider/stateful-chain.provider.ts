import { InvalidArgumentException } from '../exception';
import { LoggerInterface, NullLogger } from '../logger';
import { AbstractHttpProvider, AbstractProvider, Address, GeocodeQuery, ReverseQuery } from '../model';

export class StatefulChainProvider extends AbstractProvider {
    private nextProvider: AbstractHttpProvider;
    private readonly logger: LoggerInterface;

    constructor(private readonly providers: AbstractHttpProvider[], logger?: LoggerInterface) {
        super();

        if (!providers.length) {
            throw new InvalidArgumentException('provider array should not be empty');
        }

        this.setNextProvider();
        this.logger = logger || new NullLogger();
    }

    async geocode(query: GeocodeQuery): Promise<Address[]> {
        for (const provider of this.getOrderedProvidersList()) {
            try {
                this.setNextProvider();
                if (query.accuracy && !provider.isProvidesAccuracy(query.accuracy)) {
                    this.logger.info(
                        `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${provider.maxAccuracy}")`,
                    );
                    continue;
                }

                const addresses: Address[] = await provider.geocode(query);

                if (addresses.length) {
                    return addresses;
                }
            } catch (err) {
                this.logger.error(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQuery): Promise<Address[]> {
        for (const provider of this.getOrderedProvidersList()) {
            try {
                this.setNextProvider();
                if (query.accuracy && !provider.isProvidesAccuracy(query.accuracy)) {
                    this.logger.info(
                        `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${provider.maxAccuracy}")`,
                    );
                    continue;
                }

                const addresses: Address[] = await provider.reverse(query);

                if (addresses.length) {
                    return addresses;
                }
            } catch (err) {
                this.logger.error(err);
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
     * Queue of providers
     */
    private getOrderedProvidersList(): AbstractHttpProvider[] {
        const nextProviderIndex: number = this.providers.indexOf(this.nextProvider);

        return this.getProviders()
            .slice(nextProviderIndex)
            .concat(this.getProviders().slice(0, nextProviderIndex));
    }
}

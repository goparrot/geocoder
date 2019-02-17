import { AbstractDecider, CircularDecider } from '../decider';
import { ProviderNotRegisteredException } from '../exception/provider-not-registered.exception';
import { GeocodeQueryInterface, ReverseQueryInterface, Type } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider, Address } from '../model';
import { AbstractGeocoder } from './abstract-geocoder';

export class ProviderAggregator extends AbstractGeocoder {
    private readonly providers: AbstractProvider[] = [];
    private provider: AbstractProvider;
    private readonly decider: AbstractDecider;

    constructor(decider?: AbstractDecider, logger?: LoggerInterface) {
        super(logger);

        this.decider = decider || new CircularDecider();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Address[]> {
        if (!this.providers.length) {
            throw ProviderNotRegisteredException.noProviderRegistered();
        }

        const provider: AbstractProvider = await this.decider.geocode(query, this.providers, this.provider);

        return this.geocodeByProvider(provider, query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Address[]> {
        if (!this.providers.length) {
            throw ProviderNotRegisteredException.noProviderRegistered();
        }

        const provider: AbstractProvider = await this.decider.reverse(query, this.providers, this.provider);

        return this.reverseByProvider(provider, query);
    }

    using<T extends AbstractProvider>(providerClass: Type<T>): this {
        if (!(providerClass.prototype instanceof AbstractProvider)) {
            throw ProviderNotRegisteredException.doesNotInheritAbstractProvider(providerClass.name);
        }

        const foundProvider: AbstractProvider | undefined = this.providers.find(
            (provider: AbstractProvider) => providerClass.name === provider.constructor.name,
        );
        if (!foundProvider) {
            throw ProviderNotRegisteredException.create(providerClass.name, this.providers);
        }
        this.provider = foundProvider;

        return this;
    }

    getProviders(): AbstractProvider[] {
        return this.providers;
    }

    registerProvider(provider: AbstractProvider): this {
        this.providers.push(provider);

        return this;
    }

    registerProviders(providers: AbstractProvider[]): this {
        for (const provider of providers) {
            this.registerProvider(provider);
        }

        return this;
    }
}

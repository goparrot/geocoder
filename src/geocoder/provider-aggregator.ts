import { AbstractDecider, StatelessDecider } from '../decider';
import { ProviderNotRegisteredException } from '../exception';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider, Location } from '../model';
import { Type } from '../types';
import { AbstractGeocoder } from './abstract-geocoder';

export class ProviderAggregator extends AbstractGeocoder {
    private readonly providers: AbstractProvider[] = [];
    private provider: AbstractProvider;
    private readonly decider: AbstractDecider;

    constructor(decider?: AbstractDecider) {
        super();

        this.decider = decider || new StatelessDecider();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        const provider: AbstractProvider = await this.decider.getProvider(this.providers, this.provider);

        return this.geocodeByProvider(provider, query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        const provider: AbstractProvider = await this.decider.getProvider(this.providers, this.provider);

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

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        for (const provider of this.getProviders()) {
            provider.setLogger(logger);
        }

        return this;
    }
}

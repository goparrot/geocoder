import { ProviderNotRegisteredException } from '../exception';
import { GeocodeQueryInterface, GeocoderInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggableMixin } from '../logger';
import { AbstractChainProvider, AbstractHttpProvider, AbstractProvider, Location, ProvidableMixin, Suggestion } from '../model';
import { Type } from '../types';

export abstract class AbstractGeocoder extends ProvidableMixin(LoggableMixin(Object)) implements GeocoderInterface {
    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;

    abstract async suggest(query: SuggestQueryInterface): Promise<Suggestion[]>;

    protected async geocodeByProvider(provider: AbstractProvider, query: GeocodeQueryInterface): Promise<Location[]> {
        return provider.geocode(query);
    }

    protected async reverseByProvider(provider: AbstractProvider, query: ReverseQueryInterface): Promise<Location[]> {
        return provider.reverse(query);
    }

    protected async suggestByProvider(provider: AbstractProvider, query: SuggestQueryInterface): Promise<Suggestion[]> {
        return provider.suggest(query);
    }

    using<T extends AbstractHttpProvider>(providerClass: Type<T> | string): AbstractHttpProvider {
        let providerClassName: string;

        if (typeof providerClass === 'function') {
            if (!(providerClass.prototype instanceof AbstractHttpProvider)) {
                throw ProviderNotRegisteredException.doesNotInheritAbstractProvider(providerClass.name);
            }

            providerClassName = providerClass.name;
        } else {
            providerClassName = providerClass;
        }

        for (const provider of this.getProviders()) {
            const foundProvider: AbstractHttpProvider | undefined = this.findHttpProviderRecursive(providerClassName, provider);

            if (foundProvider) {
                return foundProvider;
            }
        }

        throw ProviderNotRegisteredException.create(providerClassName, this.getProviders());
    }

    private findHttpProviderRecursive(providerClassName: string, provider: AbstractProvider): AbstractHttpProvider | undefined {
        if (provider instanceof AbstractHttpProvider && providerClassName === provider.constructor.name) {
            return provider;
        }

        if (provider instanceof AbstractChainProvider) {
            for (const internalProvider of provider.getProviders()) {
                const foundProvider: AbstractHttpProvider | undefined = this.findHttpProviderRecursive(providerClassName, internalProvider);
                if (foundProvider) {
                    return foundProvider;
                }
            }

            return;
        }
    }
}

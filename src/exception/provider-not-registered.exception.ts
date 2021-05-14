import { GeocoderException } from './geocoder.exception';
import type { AbstractProvider } from '../model';

export class ProviderNotRegisteredException extends GeocoderException {
    static create(providerClassName: string, registeredProviders: AbstractProvider[] = []): ProviderNotRegisteredException {
        return new ProviderNotRegisteredException(
            `Provider "${providerClassName}" is not registered, so you cannot use it. Did you forget to register it or made a typo?${
                !registeredProviders.length
                    ? ''
                    : ` Registered providers are: [${registeredProviders.map((provider: AbstractProvider) => provider.constructor.name)}]`
            }`,
        );
    }

    static noProviderRegistered(): ProviderNotRegisteredException {
        return new ProviderNotRegisteredException('No provider registered.');
    }

    static doesNotInheritAbstractProvider(className: string): ProviderNotRegisteredException {
        return new ProviderNotRegisteredException(`The class "${className}" does not inherit AbstractProvider.`);
    }
}

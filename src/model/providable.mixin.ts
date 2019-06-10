import { ProviderNotRegisteredException } from '../exception';
import { LoggableInterface, LoggerInterface } from '../logger';
import { Constructor } from '../types';
import { AbstractProvider } from './abstract-provider';
import { ProvidableInterface } from './providable.interface';

export function ProvidableMixin<TBase extends Constructor<LoggableInterface>>(Base: TBase): TBase & Constructor<ProvidableInterface> {
    return class extends Base {
        private readonly providers: AbstractProvider[] = [];

        constructor(...args: any[]) {
            super();

            const [providers]: [AbstractProvider[]] = args as any;

            if (!providers.length) {
                throw ProviderNotRegisteredException.noProviderRegistered();
            }

            this.registerProviders(providers);
        }

        getFirstProvider(): AbstractProvider {
            return this.getProviders()[0];
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
    };
}

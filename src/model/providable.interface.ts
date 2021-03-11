import type { LoggerInterface } from '../logger';
import type { AbstractProvider } from './abstract-provider';

export interface ProvidableInterface {
    getProviders(): AbstractProvider[];
    getFirstProvider(): AbstractProvider;
    registerProvider(provider: AbstractProvider): this;
    registerProviders(providers: AbstractProvider[]): this;
    setLogger(logger: LoggerInterface): this;
}

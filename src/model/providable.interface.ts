import { LoggerInterface } from '../logger';
import { AbstractProvider } from './abstract-provider';

export interface ProvidableInterface {
    getProviders(): AbstractProvider[];
    getFirstProvider(): AbstractProvider;
    registerProvider(provider: AbstractProvider): this;
    registerProviders(providers: AbstractProvider[]): this;
    setLogger(logger: LoggerInterface): this;
}

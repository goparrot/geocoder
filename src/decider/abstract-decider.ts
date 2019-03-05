import { AbstractProvider } from '../model';

export abstract class AbstractDecider {
    abstract async getProvider(providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider>;
}

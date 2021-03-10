import { AbstractProvider } from '../model';

export abstract class AbstractDecider {
    abstract getProvider(providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider>;
}

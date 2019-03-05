import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { AbstractProvider } from '../model';

export abstract class AbstractDecider {
    abstract async geocode(query: GeocodeQueryInterface, providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider>;

    abstract async reverse(query: ReverseQueryInterface, providers: AbstractProvider[], forceProvider?: AbstractProvider): Promise<AbstractProvider>;
}

import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { AbstractProvider } from '../model';

export abstract class AbstractDecider {
    abstract async geocode(query: GeocodeQueryInterface, providers: AbstractProvider[], currentProvider: AbstractProvider): Promise<AbstractProvider>;

    abstract async reverse(query: ReverseQueryInterface, providers: AbstractProvider[], currentProvider: AbstractProvider): Promise<AbstractProvider>;
}

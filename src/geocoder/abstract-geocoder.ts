import { GeocodeQueryInterface, GeocoderInterface, ReverseQueryInterface } from '../interface';
import { LoggableMixin } from '../logger';
import { AbstractProvider, Location } from '../model';

export abstract class AbstractGeocoder extends LoggableMixin(Object) implements GeocoderInterface {
    abstract async geocode(query: GeocodeQueryInterface): Promise<Location[]>;

    abstract async reverse(query: ReverseQueryInterface): Promise<Location[]>;

    /**
     * @throws {GeocoderException}
     */
    protected async geocodeByProvider(provider: AbstractProvider, query: GeocodeQueryInterface): Promise<Location[]> {
        return provider.geocode(query);
    }

    protected async reverseByProvider(provider: AbstractProvider, query: ReverseQueryInterface): Promise<Location[]> {
        return provider.reverse(query);
    }
}

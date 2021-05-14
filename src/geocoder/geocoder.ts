import { AbstractGeocoder } from './abstract-geocoder';
import type { DistanceQueryInterface, GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import type { AbstractProvider, Distance, Location, Suggestion } from '../model';

export class Geocoder extends AbstractGeocoder {
    constructor(provider: AbstractProvider) {
        super([provider]);
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        return this.geocodeByProvider(this.getFirstProvider(), query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        return this.reverseByProvider(this.getFirstProvider(), query);
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        return this.suggestByProvider(this.getFirstProvider(), query);
    }

    async distance(query: DistanceQueryInterface): Promise<Distance> {
        return this.distanceByProvider(this.getFirstProvider(), query);
    }
}

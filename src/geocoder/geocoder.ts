import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import type { AbstractProvider, Location, Suggestion } from '../model';
import { AbstractGeocoder } from './abstract-geocoder';

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
}

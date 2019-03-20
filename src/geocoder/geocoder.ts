import { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider, Location, Suggestion } from '../model';
import { AbstractGeocoder } from './abstract-geocoder';

export class Geocoder extends AbstractGeocoder {
    constructor(private readonly provider: AbstractProvider) {
        super();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        return this.geocodeByProvider(this.provider, query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        return this.reverseByProvider(this.provider, query);
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        return this.suggestByProvider(this.provider, query);
    }

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        this.provider.setLogger(logger);

        return this;
    }
}

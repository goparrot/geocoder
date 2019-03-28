import { AbstractDecider, StatelessDecider } from '../decider';
import { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { AbstractProvider, Location, Suggestion } from '../model';
import { AbstractGeocoder } from './abstract-geocoder';

export class ProviderAggregator extends AbstractGeocoder {
    private readonly decider: AbstractDecider;

    constructor(providers: AbstractProvider[], decider?: AbstractDecider) {
        super(providers);

        this.decider = decider || new StatelessDecider();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        const provider: AbstractProvider = await this.decider.getProvider(this.getProviders());

        return this.geocodeByProvider(provider, query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        const provider: AbstractProvider = await this.decider.getProvider(this.getProviders());

        return this.reverseByProvider(provider, query);
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        const provider: AbstractProvider = await this.decider.getProvider(this.getProviders());

        return this.suggestByProvider(provider, query);
    }
}

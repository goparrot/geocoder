import { UnsupportedOperationException } from '../exception';
import { AbstractProvider } from './abstract-provider';
import type {
    DistanceQueryInterface,
    GeocodeQueryInterface,
    HttpProviderCommandsInterface,
    PlaceDetailsQueryInterface,
    ReverseQueryInterface,
    SuggestQueryInterface,
} from '../interface';
import type { LoggerInterface } from '../logger';
import type { Distance } from './distance';
import type { Location } from './location';
import type { Suggestion } from './suggestion';

export abstract class AbstractHttpProvider extends AbstractProvider {
    protected constructor(private readonly commands: HttpProviderCommandsInterface) {
        super();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        return this.commands.geocode.execute(query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        return this.commands.reverse.execute(query);
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        if (!this.commands.suggest) {
            throw new UnsupportedOperationException(`Provider ${this.constructor.name} doesn't support "suggest" method`);
        }

        return this.commands.suggest.execute(query);
    }

    async placeDetails(query: PlaceDetailsQueryInterface): Promise<Location> {
        if (!this.commands.placeDetails) {
            throw new UnsupportedOperationException(`Provider ${this.constructor.name} doesn't support "placeDetails" method`);
        }

        return (await this.commands.placeDetails.execute(query))[0];
    }

    async distance(query: DistanceQueryInterface): Promise<Distance> {
        if (!this.commands.distance) {
            throw new UnsupportedOperationException(`Provider ${this.constructor.name} doesn't support "distance" method`);
        }

        return (await this.commands.distance.execute(query))[0];
    }

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);

        for (const command of Object.values(this.commands)) {
            command.setLogger(logger);
        }

        return this;
    }
}

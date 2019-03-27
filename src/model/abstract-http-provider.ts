import { UnsupportedOperationException } from '../exception';
import { GeocodeQueryInterface, HttpProviderCommandsInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider } from './abstract-provider';
import { Location } from './location';
import { Suggestion } from './suggestion';

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

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        this.commands.geocode.setLogger(logger);
        this.commands.reverse.setLogger(logger);

        if (this.commands.suggest) {
            this.commands.suggest.setLogger(logger);
        }

        return this;
    }
}

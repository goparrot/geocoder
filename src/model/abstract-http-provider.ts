import { GeocodeCommand, ReverseCommand, SuggestCommand } from '../command';
import { UnsupportedOperationException } from '../exception';
import { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider } from './abstract-provider';
import { Location } from './location';
import { Suggestion } from './suggestion';

export abstract class AbstractHttpProvider extends AbstractProvider {
    protected constructor(
        private readonly geocodeCommand: GeocodeCommand,
        private readonly reverseCommand: ReverseCommand,
        private readonly suggestCommand?: SuggestCommand,
    ) {
        super();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        return this.geocodeCommand.execute(query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        return this.reverseCommand.execute(query);
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        if (!this.suggestCommand) {
            throw new UnsupportedOperationException(`Provider ${this.constructor.name} doesn't support "suggest" method`);
        }

        return this.suggestCommand.execute(query);
    }

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        this.geocodeCommand.setLogger(logger);
        this.reverseCommand.setLogger(logger);

        if (this.reverseCommand) {
            this.reverseCommand.setLogger(logger);
        }

        return this;
    }
}

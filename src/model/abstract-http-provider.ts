import { GeocodeCommand, ReverseCommand } from '../command';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider } from './abstract-provider';
import { Location } from './location';

export abstract class AbstractHttpProvider extends AbstractProvider {
    protected constructor(private readonly geocodeCommand: GeocodeCommand, private readonly reverseCommand: ReverseCommand) {
        super();
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        return this.geocodeCommand.execute(query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        return this.reverseCommand.execute(query);
    }

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        this.geocodeCommand.setLogger(logger);
        this.reverseCommand.setLogger(logger);

        return this;
    }
}

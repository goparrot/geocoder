import { InvalidArgumentException } from '../exception';
import { LoggerInterface, NullLogger } from '../logger';
import { AbstractHttpProvider, AbstractProvider, GeocodeQuery, Location, ReverseQuery } from '../model';

export class ChainProvider extends AbstractProvider {
    private readonly logger: LoggerInterface;

    constructor(private readonly providers: AbstractHttpProvider[], logger?: LoggerInterface) {
        super();

        if (!this.providers.length) {
            throw new InvalidArgumentException('provider array should not be empty');
        }

        this.logger = logger || new NullLogger();
    }

    async geocode(query: GeocodeQuery): Promise<Location[]> {
        for (const provider of this.providers) {
            try {
                if (query.accuracy && !provider.isProvidesAccuracy(query.accuracy)) {
                    this.logger.debug(
                        `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${provider.maxAccuracy}")`,
                    );
                    continue;
                }

                const locations: Location[] = await provider.geocode(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                this.logger.error(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQuery): Promise<Location[]> {
        for (const provider of this.providers) {
            try {
                if (query.accuracy && !provider.isProvidesAccuracy(query.accuracy)) {
                    this.logger.debug(
                        `provider ${provider.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${provider.maxAccuracy}")`,
                    );
                    continue;
                }

                const locations: Location[] = await provider.reverse(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                this.logger.error(err);
            }
        }

        return [];
    }

    getProviders(): AbstractHttpProvider[] {
        return this.providers;
    }

    registerProvider(provider: AbstractHttpProvider): this {
        this.providers.push(provider);

        return this;
    }

    registerProviders(providers: AbstractHttpProvider[]): this {
        for (const provider of providers) {
            this.registerProvider(provider);
        }

        return this;
    }
}

import { InvalidArgumentException } from '../exception';
import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractHttpProvider, AbstractProvider, Location } from '../model';

export class ChainProvider extends AbstractProvider {
    constructor(private readonly providers: AbstractHttpProvider[]) {
        super();

        if (!this.providers.length) {
            throw new InvalidArgumentException('provider array should not be empty');
        }
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        for (const provider of this.providers) {
            try {
                const locations: Location[] = await provider.geocode(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                this.getLogger().error(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        for (const provider of this.providers) {
            try {
                const locations: Location[] = await provider.reverse(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err) {
                this.getLogger().error(err);
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

    setLogger(logger: LoggerInterface): this {
        super.setLogger(logger);
        for (const provider of this.getProviders()) {
            provider.setLogger(logger);
        }

        return this;
    }
}

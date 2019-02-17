import { LoggerInterface, NullLogger } from '../logger';
import { AbstractHttpProvider, AbstractProvider, Address, GeocodeQuery, ReverseQuery } from '../model';

export class ChainProvider extends AbstractProvider {
    private readonly logger: LoggerInterface;

    constructor(private readonly providers: AbstractHttpProvider[] = [], logger?: LoggerInterface) {
        super();

        this.logger = logger || new NullLogger();
    }

    async geocode(query: GeocodeQuery): Promise<Address[]> {
        for (const provider of this.providers) {
            try {
                const addresses: Address[] = await provider.geocode(query);

                if (addresses.length) {
                    return addresses;
                }
            } catch (err) {
                this.logger.error(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQuery): Promise<Address[]> {
        for (const provider of this.providers) {
            try {
                const addresses: Address[] = await provider.reverse(query);

                if (addresses.length) {
                    return addresses;
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

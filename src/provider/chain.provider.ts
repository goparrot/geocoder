import { ValidationException } from '../exception';
import { AbstractChainProvider } from '../model';
import type { GeocodeQueryInterface, ReverseQueryInterface, SuggestQueryInterface } from '../interface';
import type { AbstractHttpProvider, Location, Suggestion } from '../model';

export class ChainProvider extends AbstractChainProvider {
    constructor(providers: AbstractHttpProvider[]) {
        super(providers);
    }

    async geocode(query: GeocodeQueryInterface): Promise<Location[]> {
        for (const provider of this.getProviders()) {
            try {
                const locations: Location[] = await provider.geocode(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err: any) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }

    async reverse(query: ReverseQueryInterface): Promise<Location[]> {
        for (const provider of this.getProviders()) {
            try {
                const locations: Location[] = await provider.reverse(query);

                if (locations.length) {
                    return locations;
                }
            } catch (err: any) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }

    async suggest(query: SuggestQueryInterface): Promise<Suggestion[]> {
        for (const provider of this.getProviders()) {
            try {
                return await provider.suggest(query);
            } catch (err: any) {
                if (err instanceof ValidationException) {
                    throw err;
                }

                this.getLogger().warn(err);
            }
        }

        return [];
    }
}

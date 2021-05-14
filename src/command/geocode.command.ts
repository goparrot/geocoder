import { ExactMatchNotFoundException } from '../exception';
import { GeocodeQuery } from '../model';
import type { GeocodeQueryInterface } from '../interface';
import type { Location } from '../model';
import { AbstractLocationCommand } from './abstract-location.command';

export class GeocodeCommand<ProviderRequestType = any, ProviderResponseType = any> extends AbstractLocationCommand<
    GeocodeQueryInterface,
    ProviderRequestType,
    ProviderResponseType
> {
    static queryClass(): typeof GeocodeQuery {
        return GeocodeQuery;
    }

    async execute(query: GeocodeQueryInterface): Promise<Location[]> {
        const locations: Location[] = await super.execute(query);

        this.validateExactMatchOption(query, locations);

        return locations;
    }

    /**
     * @throws {ExactMatchNotFoundException}
     */
    private validateExactMatchOption(query: GeocodeQueryInterface, locations: Location[]): void {
        if (!query.exactMatch || !locations.length) {
            return;
        }

        if (locations.length > 1) {
            throw new ExactMatchNotFoundException('More than one result', { query, locations });
        }

        const location: Location = locations[0];

        if ((query.countryCode && query.countryCode !== location.countryCode) || (query.stateCode && query.stateCode !== location.stateCode)) {
            throw new ExactMatchNotFoundException('Does not match the terms of the query', { query, location });
        }
    }
}

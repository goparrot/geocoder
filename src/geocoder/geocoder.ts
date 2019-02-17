import { GeocodeQueryInterface, ReverseQueryInterface } from '../interface';
import { LoggerInterface } from '../logger';
import { AbstractProvider, Address } from '../model';
import { AbstractGeocoder } from './abstract-geocoder';

export class Geocoder extends AbstractGeocoder {
    constructor(private readonly provider: AbstractProvider, logger?: LoggerInterface) {
        super(logger);
    }

    async geocode(query: GeocodeQueryInterface): Promise<Address[]> {
        return this.geocodeByProvider(this.provider, query);
    }

    async reverse(query: ReverseQueryInterface): Promise<Address[]> {
        return this.reverseByProvider(this.provider, query);
    }
}

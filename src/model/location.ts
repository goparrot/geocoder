import type { ClassTransformOptions } from 'class-transformer';
import { classToPlain, Exclude, Expose } from 'class-transformer';
import type { LocationInterface } from '../interface';

@Exclude()
export class Location<ProviderRawEntryType = any> implements LocationInterface<ProviderRawEntryType> {
    @Expose()
    provider: string;

    /**
     * @example 1200 E 89th St, Chicago, IL 60619, USA
     * @example 1158 E 89th St, Chicago, Illinois 60619, US
     */
    @Expose({ name: 'formattedAddress', toClassOnly: true })
    formattedAddress?: string;

    @Expose()
    latitude: number;

    @Expose()
    longitude: number;

    @Expose()
    country?: string;

    @Expose()
    countryCode?: string;

    @Expose()
    state?: string;

    /**
     * can be as ISO 3166-1 alpha-2 or an arbitrary string for countries that have no states
     */
    @Expose()
    stateCode?: string;

    @Expose()
    city?: string;

    @Expose()
    postalCode?: string;

    @Expose()
    streetName?: string;

    @Expose()
    houseNumber?: string;

    @Expose()
    placeId?: string;

    @Expose({ groups: ['raw', 'all'] })
    raw?: ProviderRawEntryType;

    get street(): string {
        return `${this.houseNumber || ''} ${this.streetName || ''}`.trim();
    }

    @Expose({ name: 'formattedAddress', toPlainOnly: true })
    generateFormattedAddress(): string {
        return this.formattedAddress
            ? this.formattedAddress
            : [
                  this.street || '',
                  this.city || '',
                  `${this.stateCode || this.state || ''} ${this.postalCode || ''}`.trim(),
                  this.country || this.countryCode || '',
              ]
                  .filter(Boolean)
                  .join(', ');
    }

    toObject(options?: ClassTransformOptions): LocationInterface<ProviderRawEntryType> {
        return classToPlain<Location<ProviderRawEntryType>>(this, options) as LocationInterface<ProviderRawEntryType>;
    }
}

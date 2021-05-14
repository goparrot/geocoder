import { classToPlain, Exclude, Expose } from 'class-transformer';
import type { ClassTransformOptions } from 'class-transformer';
import type { SuggestionInterface } from '../interface';

@Exclude()
export class Suggestion<ProviderRawEntryType = any> implements SuggestionInterface<ProviderRawEntryType> {
    @Expose()
    formattedAddress: string;

    @Expose()
    placeId: string;

    @Expose()
    provider: string;

    @Expose({ groups: ['raw', 'all'] })
    raw?: ProviderRawEntryType;

    toObject(options?: ClassTransformOptions): SuggestionInterface<ProviderRawEntryType> {
        return classToPlain<Suggestion<ProviderRawEntryType>>(this, options) as SuggestionInterface<ProviderRawEntryType>;
    }
}

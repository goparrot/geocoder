import { classToPlain, ClassTransformOptions, Exclude, Expose } from 'class-transformer';
import { SuggestionInterface } from '../interface';

@Exclude()
export class Suggestion<R = any> implements SuggestionInterface<R> {
    @Expose()
    formattedAddress: string;

    @Expose()
    placeId: string;

    @Expose()
    provider: string;

    @Expose({ groups: ['raw', 'all'] })
    raw?: R;

    toObject(options?: ClassTransformOptions): SuggestionInterface<R> {
        return classToPlain<Suggestion<R>>(this, options) as SuggestionInterface<R>;
    }
}

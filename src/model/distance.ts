import { classToPlain, Exclude, Expose } from 'class-transformer';
import type { ClassTransformOptions } from 'class-transformer';
import type { DistanceDetailsInterface } from '../interface';

@Exclude()
export class Distance<ProviderRawEntryType = any> implements DistanceDetailsInterface<ProviderRawEntryType> {
    @Expose()
    distance: number;

    @Expose()
    duration: number;

    @Expose()
    provider: string;

    @Expose({ groups: ['raw', 'all'] })
    raw?: ProviderRawEntryType;

    toObject(options?: ClassTransformOptions): DistanceDetailsInterface<ProviderRawEntryType> {
        return classToPlain<Distance<ProviderRawEntryType>>(this, options) as DistanceDetailsInterface<ProviderRawEntryType>;
    }
}

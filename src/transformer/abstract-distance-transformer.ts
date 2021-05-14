import { plainToClass } from 'class-transformer';
import { Distance } from '../model/distance';
import { AbstractTransformer } from './abstract-transformer';
import type { ClassTransformOptions } from 'class-transformer';
import type { DistanceDetailsInterface } from '../interface';
import type { AbstractHttpProvider } from '../model';

export abstract class AbstractDistanceTransformer<HttpProviderClass extends AbstractHttpProvider = any, ProviderRawEntryType = any> extends AbstractTransformer<
    HttpProviderClass,
    ProviderRawEntryType
> {
    abstract getDistance(): Promise<DistanceDetailsInterface['distance']>;
    abstract getDuration(): Promise<DistanceDetailsInterface['duration']>;

    async transform(options?: ClassTransformOptions): Promise<Distance<ProviderRawEntryType>> {
        const distance: Distance = new Distance<ProviderRawEntryType>();

        distance.provider = this.provider;
        distance.distance = await this.getDistance();
        distance.duration = await this.getDuration();
        distance.raw = this.raw;

        return plainToClass<Distance<ProviderRawEntryType>, DistanceDetailsInterface<ProviderRawEntryType>>(Distance, distance, options);
    }
}

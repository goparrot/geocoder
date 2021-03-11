import type { ClassTransformOptions } from 'class-transformer';
import type { AbstractHttpProvider } from '../model';
import type { Type } from '../types';

export abstract class AbstractTransformer<HttpProviderClass extends AbstractHttpProvider = any, ProviderRawEntryType = any> {
    readonly provider: string;
    readonly raw: ProviderRawEntryType;

    constructor(providerClass: Type<HttpProviderClass>, raw: ProviderRawEntryType) {
        this.provider = providerClass.name;
        this.raw = raw;
    }

    abstract transform(options?: ClassTransformOptions): Promise<any>;
}

import { ClassTransformOptions } from 'class-transformer';
import { AbstractHttpProvider } from '../model';
import { Type } from '../types';

export abstract class AbstractTransformer<HttpProviderClass extends AbstractHttpProvider = any, ProviderRawEntryType = any> {
    readonly provider: string;
    readonly raw: ProviderRawEntryType;

    constructor(providerClass: Type<HttpProviderClass>, raw: ProviderRawEntryType) {
        this.provider = providerClass.name;
        this.raw = raw;
    }

    abstract async transform(options?: ClassTransformOptions): Promise<any>;
}

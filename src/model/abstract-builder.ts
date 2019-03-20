import { ClassTransformOptions } from 'class-transformer';
import { Type } from '../types';
import { AbstractHttpProvider } from './abstract-http-provider';

export abstract class AbstractBuilder<T extends AbstractHttpProvider = any, R = any> {
    readonly provider: string;

    constructor(providerClass: Type<T>, readonly raw: R) {
        this.provider = providerClass.name;
    }

    abstract async build(options?: ClassTransformOptions): Promise<any>;
}

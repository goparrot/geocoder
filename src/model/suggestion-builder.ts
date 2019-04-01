import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { SuggestionInterface } from '../interface';
import { AbstractBuilder } from './abstract-builder';
import { AbstractHttpProvider } from './abstract-http-provider';
import { Suggestion } from './suggestion';

export class SuggestionBuilder<T extends AbstractHttpProvider = any, R = any> extends AbstractBuilder<T, R> implements SuggestionInterface<R> {
    formattedAddress: string;
    placeId: string;

    async build(options?: ClassTransformOptions): Promise<Suggestion<R>> {
        return plainToClass<Suggestion<R>, SuggestionInterface<R>>(Suggestion, this, options);
    }
}

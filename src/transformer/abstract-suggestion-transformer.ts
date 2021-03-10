import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { SuggestionInterface } from '../interface';
import { AbstractHttpProvider, Suggestion } from '../model';
import { AbstractTransformer } from './abstract-transformer';

export abstract class AbstractSuggestionTransformer<
    HttpProviderClass extends AbstractHttpProvider = any,
    ProviderRawEntryType = any
> extends AbstractTransformer<HttpProviderClass, ProviderRawEntryType> {
    abstract getFormattedAddress(): Promise<SuggestionInterface['formattedAddress']>;
    abstract getPlaceId(): Promise<SuggestionInterface['placeId']>;

    async transform(options?: ClassTransformOptions): Promise<Suggestion<ProviderRawEntryType>> {
        const suggestion: Suggestion = new Suggestion<ProviderRawEntryType>();

        suggestion.provider = this.provider;
        suggestion.formattedAddress = await this.getFormattedAddress();
        suggestion.placeId = await this.getPlaceId();
        suggestion.raw = this.raw;

        return plainToClass<Suggestion<ProviderRawEntryType>, SuggestionInterface<ProviderRawEntryType>>(Suggestion, suggestion, options);
    }
}

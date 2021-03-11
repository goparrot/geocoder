import { AbstractSuggestionTransformer } from '../../../transformer';
import { ArcgisProvider } from '../arcgis.provider';
import type { ArcgisSuggestionInterface } from '../interface';

export class ArcgisSuggestionTransformer extends AbstractSuggestionTransformer<ArcgisProvider> {
    constructor(readonly raw: ArcgisSuggestionInterface) {
        super(ArcgisProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.text;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.magicKey;
    }
}

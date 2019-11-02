import { AbstractSuggestionTransformer } from '../../../transformer';
import { MapQuestProvider } from '../map-quest.provider';

export class MapQuestSuggestionTransformer extends AbstractSuggestionTransformer<MapQuestProvider> {
    constructor(raw: any) {
        super(MapQuestProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.displayString;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.id;
    }
}

import { AbstractSuggestionTransformer } from '../../../transformer';
import { HereProvider } from '../here.provider';
import type { HereOneResultAddressType, HereOneResultType } from '../interface';

export class HereSuggestionTransformer extends AbstractSuggestionTransformer<HereProvider> {
    constructor(raw: HereOneResultType) {
        super(HereProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.getLocationAddress().Label ?? '';
    }

    async getPlaceId(): Promise<string> {
        return this.raw.Location.LocationId;
    }

    private getLocationAddress(): HereOneResultAddressType {
        return this.raw.Location.Address || {};
    }
}

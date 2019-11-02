import { AbstractSuggestionTransformer } from '../../../transformer';
import { GoogleMapsProvider } from '../google-maps.provider';

export class GoogleMapsSuggestionTransformer extends AbstractSuggestionTransformer<GoogleMapsProvider> {
    constructor(raw: any) {
        super(GoogleMapsProvider, raw);
    }

    async getFormattedAddress(): Promise<string> {
        return this.raw.description;
    }

    async getPlaceId(): Promise<string> {
        return this.raw.place_id;
    }
}

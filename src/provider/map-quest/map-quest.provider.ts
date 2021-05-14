import { AbstractHttpProvider } from '../../model';
import { MapQuestGeocodeCommand, MapQuestReverseCommand } from './command';
import type { AxiosInstance } from 'axios';

export class MapQuestProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super({
            geocode: new MapQuestGeocodeCommand(httpClient, apiKey),
            reverse: new MapQuestReverseCommand(httpClient, apiKey),
            // no sense without MapQuestPlaceIdCommand
            // suggest: new MapQuestSuggestCommand(httpClient, apiKey),
        });
    }
}

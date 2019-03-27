import { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { MapQuestGeocodeCommand, MapQuestReverseCommand, MapQuestSuggestCommand } from './command';

export class MapQuestProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super({
            geocode: new MapQuestGeocodeCommand(httpClient, apiKey),
            reverse: new MapQuestReverseCommand(httpClient, apiKey),
            suggest: new MapQuestSuggestCommand(httpClient, apiKey),
        });
    }
}

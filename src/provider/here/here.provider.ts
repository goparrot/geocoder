import type { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { HereGeocodeCommand, HerePlaceDetailsCommand, HereReverseCommand, HereSuggestCommand } from './command';

export class HereProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        super({
            geocode: new HereGeocodeCommand(httpClient, appId, appCode),
            reverse: new HereReverseCommand(httpClient, appId, appCode),
            suggest: new HereSuggestCommand(httpClient, appId, appCode),
            placeDetails: new HerePlaceDetailsCommand(httpClient, appId, appCode),
        });
    }
}

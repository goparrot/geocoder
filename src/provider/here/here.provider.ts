import { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { HereGeocodeCommand, HereReverseCommand } from './command';

export class HereProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        super(new HereGeocodeCommand(httpClient, appId, appCode), new HereReverseCommand(httpClient, appId, appCode));
    }
}

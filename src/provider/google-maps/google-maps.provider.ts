import { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { GoogleMapsGeocodeCommand, GoogleMapsReverseCommand } from './command';

export class GoogleMapsProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super(new GoogleMapsGeocodeCommand(httpClient, apiKey), new GoogleMapsReverseCommand(httpClient, apiKey));
    }
}

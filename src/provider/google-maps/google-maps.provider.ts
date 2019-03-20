import { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { GoogleMapsGeocodeCommand, GoogleMapsReverseCommand, GoogleMapsSuggestCommand } from './command';

export class GoogleMapsProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super(
            new GoogleMapsGeocodeCommand(httpClient, apiKey),
            new GoogleMapsReverseCommand(httpClient, apiKey),
            new GoogleMapsSuggestCommand(httpClient, apiKey),
        );
    }
}

import type { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { GoogleMapsGeocodeCommand, GoogleMapsPlaceDetailsCommand, GoogleMapsReverseCommand, GoogleMapsSuggestCommand } from './command';

export class GoogleMapsProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super({
            geocode: new GoogleMapsGeocodeCommand(httpClient, apiKey),
            reverse: new GoogleMapsReverseCommand(httpClient, apiKey),
            suggest: new GoogleMapsSuggestCommand(httpClient, apiKey),
            placeDetails: new GoogleMapsPlaceDetailsCommand(httpClient, apiKey),
        });
    }
}

import { AbstractHttpProvider } from '../../model';
import {
    GoogleMapsDistanceCommand,
    GoogleMapsGeocodeCommand,
    GoogleMapsPlaceDetailsCommand,
    GoogleMapsReverseCommand,
    GoogleMapsSuggestCommand,
} from './command';
import type { AxiosInstance } from 'axios';

export class GoogleMapsProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, apiKey: string) {
        super({
            geocode: new GoogleMapsGeocodeCommand(httpClient, apiKey),
            reverse: new GoogleMapsReverseCommand(httpClient, apiKey),
            suggest: new GoogleMapsSuggestCommand(httpClient, apiKey),
            placeDetails: new GoogleMapsPlaceDetailsCommand(httpClient, apiKey),
            distance: new GoogleMapsDistanceCommand(httpClient, apiKey),
        });
    }
}

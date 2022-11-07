import type { AxiosInstance } from 'axios';
import { AbstractHttpProvider } from '../../model';
import { MapboxGeocodeCommand, MapboxReverseCommand } from './command';
import type { MapboxGeocodeMode } from './interface';

export class MapboxProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, accessToken: string, mode: MapboxGeocodeMode) {
        super({
            geocode: new MapboxGeocodeCommand(httpClient, accessToken, mode),
            reverse: new MapboxReverseCommand(httpClient, accessToken, mode),
        });
    }
}

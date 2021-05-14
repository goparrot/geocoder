import { GeocodeCommand } from '../../../command';
import { HereLocationCommandMixin } from './mixin';
import type { AxiosInstance } from 'axios';
import type { HereGeocodeQueryInterface, HereResponseType } from '../interface';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-geocode.html}
 */
export class HereGeocodeCommand extends HereLocationCommandMixin(GeocodeCommand)<HereGeocodeQueryInterface, HereResponseType> {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        super(httpClient, appId, appCode);
    }

    static getUrl(): string {
        return 'https://geocoder.api.here.com/6.2/geocode.json';
    }
}

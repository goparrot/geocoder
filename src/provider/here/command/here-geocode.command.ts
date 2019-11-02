import { AxiosInstance } from 'axios';
import { GeocodeCommand } from '../../../command';
import { HereGeocodeQueryInterface, HereResponseType } from '../interface';
import { HereLocationCommandMixin } from './mixin';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-geocode.html}
 */
export class HereGeocodeCommand extends HereLocationCommandMixin(GeocodeCommand)<HereGeocodeQueryInterface, HereResponseType> {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        // @ts-ignore
        super(httpClient, appId, appCode);
    }

    static getUrl(): string {
        return 'https://geocoder.api.here.com/6.2/geocode.json';
    }
}

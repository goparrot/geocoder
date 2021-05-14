import { PlaceDetailsCommand } from '../../../command';
import { HereLocationCommandMixin } from './mixin';
import type { AxiosInstance } from 'axios';
import type { PlaceDetailsQuery } from '../../../model';
import type { HerePlaceDetailsQueryInterface, HereResponseType } from '../interface';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-search.html}
 */
export class HerePlaceDetailsCommand extends HereLocationCommandMixin(PlaceDetailsCommand)<HerePlaceDetailsQueryInterface, HereResponseType> {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        super(httpClient, appId, appCode);
    }

    static getUrl(): string {
        return 'https://geocoder.api.here.com/6.2/search.json';
    }

    protected async buildQuery(query: PlaceDetailsQuery): Promise<HerePlaceDetailsQueryInterface> {
        const params: HerePlaceDetailsQueryInterface = await super.buildQuery(query);

        params.locationid = query.placeId;

        return params;
    }
}

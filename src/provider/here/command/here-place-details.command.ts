import { AxiosInstance } from 'axios';
import { PlaceDetailsCommand } from '../../../command';
import { PlaceDetailsQuery } from '../../../model';
import { HerePlaceDetailsQueryInterface, HereResponseType } from '../interface';
import { HereLocationCommandMixin } from './mixin';

/**
 * @link {https://developer.here.com/documentation/geocoder/topics/resource-search.html}
 */
export class HerePlaceDetailsCommand extends HereLocationCommandMixin(PlaceDetailsCommand)<HerePlaceDetailsQueryInterface, HereResponseType> {
    constructor(httpClient: AxiosInstance, appId: string, appCode: string) {
        // @ts-ignore
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

import { AxiosInstance } from 'axios';
import { PlaceDetailsCommand } from '../../../command';
import { PlaceDetailsQuery } from '../../../model';
import { ArcgisPlaceDetailsQueryInterface } from '../interface';
import { ArcgisGeocodeCommandMixin } from './mixin';

/**
 * @link {https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm}
 */
export class ArcgisPlaceDatailsCommand extends ArcgisGeocodeCommandMixin(PlaceDetailsCommand)<ArcgisPlaceDetailsQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly token?: string) {
        super(httpClient);
    }

    static getUrl(): string {
        return 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    }

    protected async buildQuery(query: PlaceDetailsQuery): Promise<ArcgisPlaceDetailsQueryInterface> {
        return {
            token: this.token,
            forStorage: !!this.token,
            magicKey: query.placeId,
            langCode: query.language,
            locationType: 'rooftop',
            outFields: 'Addr_type,LongLabel,AddNum,StAddr,City,RegionAbbr,Region,Country,Postal,DisplayX,DisplayY',
            f: 'json',
        };
    }
}

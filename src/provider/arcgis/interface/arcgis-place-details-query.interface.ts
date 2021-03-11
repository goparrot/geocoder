/**
 * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm
 */
import type { ArcgisQueryInterface } from './arcgis-query.interface';

export interface ArcgisPlaceDetailsQueryInterface extends ArcgisQueryInterface {
    magicKey: string;
    outFields?: string;
    locationType: 'rooftop' | 'street';
}

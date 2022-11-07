import type { MapboxGeocodeFeature } from '../interface';
import { MapboxLocationTransformer } from './mapbox-location.transformer';

export class MapboxReverseTransformer extends MapboxLocationTransformer {
    constructor(raw: MapboxGeocodeFeature) {
        super(raw);
    }
}

import { AbstractDistanceTransformer } from '../../../transformer';
import { GoogleMapsProvider } from '../google-maps.provider';
import type { DistanceDetailsInterface } from '../../../interface';

export class GoogleMapsDistanceTransformer extends AbstractDistanceTransformer<GoogleMapsProvider> {
    constructor(raw: Record<string, any>) {
        super(GoogleMapsProvider, raw);
    }

    async getDistance(): Promise<DistanceDetailsInterface['distance']> {
        return this.raw.distance.value;
    }

    async getDuration(): Promise<DistanceDetailsInterface['duration']> {
        return this.raw.duration.value;
    }
}

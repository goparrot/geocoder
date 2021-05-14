import type { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException, UnsupportedAccuracyException } from '../../../../exception';
import { AccuracyEnum } from '../../../../model';
import { sliceFrom } from '../../../../util';
import { MapQuestLocationTransformer } from '../../transformer';
import type { AbstractCommand } from '../../../../command';
import type { QueryInterface } from '../../../../interface';
import type { AbstractLocationTransformer } from '../../../../transformer';
import type { Constructor } from '../../../../types';
import type { MapQuestProvider } from '../../map-quest.provider';

export enum MapQuestLocationQualityEnum {
    COUNTRY = 'COUNTRY',
    ZIP = 'ZIP',
    ZIP_EXTENDED = 'ZIP_EXTENDED',
    STATE = 'STATE',
    COUNTY = 'COUNTY',
    CITY = 'CITY',
    NEIGHBORHOOD = 'NEIGHBORHOOD',
    STREET = 'STREET',
    ADDRESS = 'ADDRESS',
    POINT = 'POINT',
}

export function MapQuestCommonCommandMixin<TBase extends Constructor<AbstractCommand>>(Base: TBase): TBase {
    abstract class MapQuestCommonCommand extends Base {
        protected readonly apiKey: any;

        protected constructor(...args: any[]) {
            const [httpClient, apiKey]: [AxiosInstance, string] = args as any;

            super(httpClient);

            this.apiKey = apiKey;

            if (!this.apiKey) {
                throw new InvalidCredentialsException('Invalid or missing api key.');
            }
        }

        protected async validateResponse(_response: AxiosResponse): Promise<void> {
            //
        }

        static getMaxAccuracy(): AccuracyEnum {
            return AccuracyEnum.STREET_NAME;
        }

        protected async parseResponse(response: AxiosResponse, query: QueryInterface): Promise<AbstractLocationTransformer<MapQuestProvider>[]> {
            if (!Array.isArray(response.data.results) || !response.data.results.length) {
                return [];
            }

            const locations: any[] = response.data.results[0].locations.filter((raw: any) => this.accuracyFilter(raw, query.accuracy));
            if (!Array.isArray(locations) || !locations.length) {
                return [];
            }

            return Promise.all<AbstractLocationTransformer<MapQuestProvider>>(
                locations.map(async (raw: any): Promise<AbstractLocationTransformer<MapQuestProvider>> => new MapQuestLocationTransformer(raw)),
            );
        }

        private accuracyFilter(raw: any, accuracy?: AccuracyEnum): boolean {
            if (!accuracy) {
                return true;
            }

            switch (accuracy) {
                // should never happen, as there is validation before
                // case AccuracyEnum.HOUSE_NUMBER:
                //     return this.isQualityAppropriate(MapQuestLocationQualityEnum.POINT, location.geocodeQuality);
                case AccuracyEnum.STREET_NAME:
                    return this.isQualityAppropriate(MapQuestLocationQualityEnum.STREET, raw.geocodeQuality);
                case AccuracyEnum.CITY:
                    return this.isQualityAppropriate(MapQuestLocationQualityEnum.CITY, raw.geocodeQuality);
                case AccuracyEnum.STATE:
                    return this.isQualityAppropriate(MapQuestLocationQualityEnum.STATE, raw.geocodeQuality);
                case AccuracyEnum.COUNTRY:
                    return this.isQualityAppropriate(MapQuestLocationQualityEnum.COUNTRY, raw.geocodeQuality);
            }

            // should never happen, as there is validation before
            throw new UnsupportedAccuracyException(`Unsupported "${accuracy}" accuracy.`);
        }

        private isQualityAppropriate(sliceToQuality: MapQuestLocationQualityEnum, locationQuality: string): boolean {
            return sliceFrom(Object.values(MapQuestLocationQualityEnum), sliceToQuality).includes(locationQuality);
        }
    }

    return MapQuestCommonCommand;
}

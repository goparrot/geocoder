import type { AxiosInstance, AxiosResponse } from 'axios';
import { GoogleMapsDistanceTransformer } from '../transformer';
import { TravelModeEnum } from '../../../model';
import { InvalidArgumentException, InvalidServerResponseException, NotFoundException, QuotaExceededException } from '../../../exception';
import { DistanceCommand } from '../../../command';
import type { DistanceQueryInterface } from '../../../interface';
import type { DistanceQuery } from '../../../model/distance-query';
import type { AbstractDistanceTransformer } from '../../../transformer';
import type { GoogleMapsProvider } from '../google-maps.provider';
import type { GoogleMapsDistanceQueryInterface } from '../interface';
import { GoogleMapsCommonCommandMixin } from './mixin';

/**
 * @link {https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests}
 */
export class GoogleMapsDistanceCommand extends GoogleMapsCommonCommandMixin(DistanceCommand)<GoogleMapsDistanceQueryInterface> {
    constructor(httpClient: AxiosInstance, private readonly apiKey: string) {
        super(httpClient, apiKey);
    }

    static getUrl(): string {
        return 'https://maps.googleapis.com/maps/api/distancematrix/json';
    }

    protected async buildQuery(query: DistanceQuery): Promise<GoogleMapsDistanceQueryInterface> {
        const providerQuery: GoogleMapsDistanceQueryInterface = {
            key: this.apiKey,
            origins: `${query.from.lat},${query.from.lon}`,
            destinations: `${query.to.lat},${query.to.lon}`,
            language: query.language,
            mode: this.getRequestMode(query.mode),
        };

        if (query.countryCode) {
            providerQuery.region = `.${query.countryCode.toLowerCase()}`;
        }

        return providerQuery;
    }

    protected async parseResponse(response: AxiosResponse, _query: DistanceQueryInterface): Promise<AbstractDistanceTransformer<GoogleMapsProvider>[]> {
        const result: Record<string, any> = response.data.rows[0].elements[0];

        return [new GoogleMapsDistanceTransformer(result)];
    }

    private getRequestMode(mode?: TravelModeEnum): GoogleMapsDistanceQueryInterface['mode'] {
        switch (mode) {
            case TravelModeEnum.WALKING:
                return 'walking';
            case TravelModeEnum.BICYCLING:
                return 'bicycling';
            case TravelModeEnum.DRIVING:
                return 'driving';
            default:
                return 'driving';
        }
    }

    /**
     * @link {https://developers.google.com/maps/documentation/distance-matrix/overview#element-level-status-codes}
     */
    protected async validateResponse(response: AxiosResponse): Promise<void> {
        switch (response.data.status) {
            case 'MAX_DIMENSIONS_EXCEEDED':
                throw new QuotaExceededException('The number of origins or destinations exceeds the per-query limit', response);
            case 'MAX_ELEMENTS_EXCEEDED':
                throw new QuotaExceededException('The product of origins and destinations exceeds the per-query limit', response);
            default:
                await super.validateResponse(response);
        }

        if (
            !Array.isArray(response.data.rows) ||
            !response.data.rows[0] ||
            !Array.isArray(response.data.rows[0].elements) ||
            !response.data.rows[0].elements[0]
        ) {
            throw new NotFoundException(`Not found`, response);
        }

        const result: Record<string, any> = response.data.rows[0].elements[0];

        switch (result.status) {
            case 'OK':
                return;
            case 'NOT_FOUND':
            case 'ZERO_RESULTS':
                throw new NotFoundException('Not found', response);
            case 'MAX_ROUTE_LENGTH_EXCEEDED':
                throw new InvalidArgumentException('Invalid request', response);
            default:
                throw new InvalidServerResponseException(`Unknown response status "${result.status}"`, response);
        }
    }
}

import type { AxiosInstance, AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import isEmpty from 'lodash.isempty';
import {
    InvalidCredentialsException,
    InvalidServerResponseException,
    QuotaExceededException,
    UnsupportedAccuracyException,
    ValidationException,
} from '../exception';
import type { QueryInterface } from '../interface';
import type { LoggableInterface } from '../logger';
import { LoggableMixin } from '../logger';
import type { AccuracyEnum } from '../model';
import type { AbstractTransformer } from '../transformer';
import type { Type } from '../types';
import { getAvailableAccuracies } from '../util';

export abstract class AbstractCommand<
    GeocoderQueryType extends QueryInterface = any,
    GeocoderResponseType = any,
    GeocoderTransformerType extends AbstractTransformer = any,
    ProviderRequestType = any,
    ProviderResponseType = any
> extends LoggableMixin(Function) {
    ['constructor']: Pick<typeof AbstractCommand, keyof typeof AbstractCommand> & { name: string } & LoggableInterface;

    constructor(protected readonly httpClient: AxiosInstance, ..._args: unknown[]) {
        super();
    }

    static queryClass(): Type<any> {
        throw new Error('AbstractCommand.queryClass: not implemented');
    }

    /**
     * @example If the provider doesn't provide separate information about house number, then AccuracyEnum.STREET_NAME should be set.
     * @important This information will be used to ignore the provider if query.accuracy is specified.
     */
    static getMaxAccuracy(): AccuracyEnum {
        throw new Error('AbstractCommand.getMaxAccuracy: not implemented');
    }

    static getUrl(): string {
        throw new Error('AbstractCommand.getUrl: not implemented');
    }

    protected async buildQuery(_query: GeocoderQueryType): Promise<ProviderRequestType> {
        throw new Error('AbstractCommand.buildQuery: not implemented');
    }

    /**
     * Must return void or throw one of GeocoderException
     * @throws {GeocoderException}
     */
    protected async validateResponse(_response: AxiosResponse<ProviderResponseType>): Promise<void> {
        throw new Error('AbstractCommand.validateResponse: not implemented');
    }

    protected async parseResponse(_response: AxiosResponse<ProviderResponseType>, _query: GeocoderQueryType): Promise<GeocoderTransformerType[]> {
        throw new Error('AbstractCommand.parseResponse: not implemented');
    }

    static isProvidesAccuracy(accuracy: AccuracyEnum): boolean {
        return getAvailableAccuracies(this.getMaxAccuracy()).includes(accuracy);
    }

    async execute(_query: GeocoderQueryType): Promise<GeocoderResponseType[]> {
        const query: GeocoderQueryType = plainToClass<GeocoderQueryType, GeocoderQueryType>(this.constructor.queryClass(), _query);

        try {
            await validateOrReject(query, {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: { target: false, value: false },
            });
        } catch (err) {
            this.getLogger().error(err, query);

            throw new ValidationException(err);
        }

        if (query.accuracy && !this.constructor.isProvidesAccuracy(query.accuracy)) {
            throw new UnsupportedAccuracyException(
                `Command ${this.constructor.name} doesn't support "${query.accuracy}" accuracy (max accuracy is "${this.constructor.getMaxAccuracy()}")`,
            );
        }

        const params: ProviderRequestType = await this.buildQuery(query);
        let response: AxiosResponse<ProviderResponseType>;

        try {
            response = await this.getResponse(params);
        } catch (err) {
            if (err.response && err.response.status) {
                const statusCode: number = err.response.status;

                if (401 === statusCode || 403 === statusCode) {
                    throw new InvalidCredentialsException(`API key is invalid`, err.response);
                } else if (429 === statusCode) {
                    throw new QuotaExceededException('Quota exceeded', err.response);
                }

                throw new InvalidServerResponseException('Server error', err.response);
            } else {
                throw new InvalidServerResponseException(err.message);
            }
        }

        if (isEmpty(response.data)) {
            throw new InvalidServerResponseException('Empty response data', response);
        }

        await this.validateResponse(response);

        const transformers: GeocoderTransformerType[] = await this.parseResponse(response, query);

        return Promise.all<GeocoderResponseType>(
            transformers.map(
                async (transformer: GeocoderTransformerType): Promise<GeocoderResponseType> => {
                    return transformer.transform({
                        groups: query.withRaw ? ['raw'] : undefined,
                    });
                },
            ),
        );
    }

    protected async getResponse(params: ProviderRequestType): Promise<AxiosResponse<ProviderResponseType>> {
        return this.httpClient.get<ProviderResponseType>(this.constructor.getUrl(), {
            params,
        });
    }
}

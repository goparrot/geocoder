import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { AbstractProvider, Address, GeocodeQuery, ReverseQuery } from '.';
import { InvalidCredentialsException, InvalidServerResponseException, QuotaExceededException } from '../exception';

export abstract class AbstractHttpProvider extends AbstractProvider {
    protected constructor(private readonly httpClient: AxiosInstance) {
        super();

        this.httpClient.interceptors.response.use(
            (response: AxiosResponse<any>): AxiosResponse<any> => {
                if (!response.data) {
                    throw new InvalidServerResponseException(`Invalid server response: ${response.config.url}`);
                }

                return response;
            },
            async (err: AxiosError) => {
                if (err.response && err.response.status) {
                    const statusCode: number = err.response.status;

                    if (401 === statusCode || 403 === statusCode) {
                        throw new InvalidCredentialsException(`API key is invalid'`);
                    } else if (429 === statusCode) {
                        throw new QuotaExceededException('Quota exceeded');
                    }

                    throw new InvalidServerResponseException(`Server error ${JSON.stringify({ status: statusCode, response: err.response.data })}`);
                } else {
                    throw new InvalidServerResponseException(err.message);
                }
            },
        );
    }

    abstract get geocodeUrl(): string;

    abstract get reverseUrl(): string;

    abstract async geocode(query: GeocodeQuery): Promise<Address[]>;

    abstract async reverse(query: ReverseQuery): Promise<Address[]>;

    protected getHttpClient(): AxiosInstance {
        return this.httpClient;
    }
}

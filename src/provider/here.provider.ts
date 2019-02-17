import { AxiosInstance, AxiosResponse } from 'axios';
import { InvalidCredentialsException } from '../exception';
import { AbstractHttpProvider, Address, GeocodeQuery, ReverseQuery } from '../model';
import { AddressBuilder } from '../model/address-builder';
import { WorldCountry, WorldCountryUtil } from '../util';

export interface HereProviderGeocodeParamsInterface {
    app_id: string;
    app_code: string;
    gen: number;
    searchtext: string;
    language: string;
    /**
     * limit
     */
    maxresults?: number;
    postalcode?: string;
    /**
     * ISO 3166-1-alpha-3
     */
    country?: string;
    state?: string;
    city?: string;
    additionaldata: string;
}

export interface HereProviderReverseParamsInterface {
    app_id: string;
    app_code: string;
    gen: number;
    language: string;
    /**
     * limit
     */
    maxresults?: number;
    /**
     * @example "lat,lon,radius"
     */
    prox: string;
    mode: string;
    additionaldata: string;
}

export class HereProvider extends AbstractHttpProvider {
    constructor(httpClient: AxiosInstance, private readonly appId: string, private readonly appCode: string) {
        super(httpClient);

        if (!this.appId || !this.appCode) {
            throw new InvalidCredentialsException('Invalid or missing api key.');
        }
    }

    /**
     * @link {https://developer.here.com/documentation/geocoder/common/request-cit-environment-rest.html}
     */
    get geocodeUrl(): string {
        return 'https://geocoder.api.here.com/6.2/geocode.json';
    }

    /**
     * @link {https://developer.here.com/documentation/geocoder/common/request-cit-environment-rest.html}
     */
    get reverseUrl(): string {
        return 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json';
    }

    /**
     * @link {https://developer.here.com/documentation/geocoder/topics/resource-geocode.html}
     */
    async geocode(query: GeocodeQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.geocodeUrl, {
            params: await this.buildGeocodeQuery(query),
        });

        return this.parseResponse(response.data);
    }

    /**
     * @link {https://developer.here.com/documentation/geocoder/topics/resource-reverse-geocode.html}
     * @param query
     */
    async reverse(query: ReverseQuery): Promise<Address[]> {
        const response: AxiosResponse = await this.getHttpClient().get(this.reverseUrl, {
            params: await this.buildReverseQuery(query),
        });

        return this.parseResponse(response.data);
    }

    private async buildGeocodeQuery(query: GeocodeQuery): Promise<HereProviderGeocodeParamsInterface> {
        const params: HereProviderGeocodeParamsInterface = {
            app_id: this.appId,
            app_code: this.appCode,
            language: query.language,
            searchtext: query.address,
            maxresults: query.limit,
            gen: 9,
            additionaldata: 'Country2,true;NormalizeNames,true',
        };

        if (query.postalCode) {
            params.postalcode = query.postalCode;
        }

        if (query.countryCode || query.country) {
            const country: WorldCountry | undefined = await WorldCountryUtil.find({
                name: query.country,
                cca2: query.countryCode,
            });

            /**
             * To avoid ambiguity we recommend to specify the country with the 3-letter ISO code and not with the spelled out country name.
             * With names there is a higher risk of misspells and also not all language translations for all countries are supported.
             */
            params.country = country ? country.cca3 : query.countryCode || query.country;

            if (query.stateCode || query.state) {
                /** Specify state using full or abbreviated notation. */
                params.state = query.stateCode || query.state;
            }

            if (query.city) {
                params.city = query.city;
            }
        }

        return params;
    }

    private async buildReverseQuery(query: ReverseQuery): Promise<HereProviderReverseParamsInterface> {
        return {
            app_id: this.appId,
            app_code: this.appCode,
            language: query.language,
            maxresults: query.limit,
            gen: 9,
            prox: `${query.lat},${query.lon},100`,
            mode: 'retrieveAddresses',
            additionaldata: 'Country2,true;NormalizeNames,true',
        };
    }

    private async parseResponse(response: any): Promise<Address[]> {
        if (!response.Response) {
            return [];
        }

        if (!response.Response.View[0]) {
            return [];
        }

        const results: any = response.Response.View[0].Result;

        return Promise.all<Address>(
            results.map(
                async (result: any): Promise<Address> => {
                    // const address: AddressBuilder<HereProvider> = new AddressBuilder(HereProvider);

                    const location: any = result.Location || {};
                    const hereAddress: any = location.Address || {};

                    const builder: AddressBuilder = new AddressBuilder(HereProvider);
                    builder.formattedAddress = hereAddress.Label;
                    builder.latitude = location.DisplayPosition.Latitude;
                    builder.longitude = location.DisplayPosition.Longitude;
                    // builder.countryCode = country ? country.cca2 : hereAddress.Country;
                    builder.state = hereAddress.State;
                    builder.stateCode = hereAddress.State;
                    builder.city = hereAddress.City;
                    builder.postalCode = hereAddress.PostalCode;
                    builder.streetName = hereAddress.Street;
                    builder.houseNumber = hereAddress.HouseNumber;

                    for (const additionalData of hereAddress.AdditionalData) {
                        switch (additionalData.key) {
                            case 'Country2':
                                builder.countryCode = additionalData.value;
                                break;
                            case 'CountryName':
                                builder.country = additionalData.value;
                                break;
                            case 'StateName':
                                builder.state = additionalData.value;
                                break;
                        }
                    }

                    if (builder.country || builder.countryCode) {
                        const country: WorldCountry | undefined = await WorldCountryUtil.find({
                            cca3: hereAddress.Country,
                        });

                        if (country) {
                            if (!builder.country) {
                                builder.country = country.name.common;
                            }

                            if (!builder.countryCode) {
                                builder.countryCode = country.cca2;
                            }
                        }
                    }

                    return builder.build();
                },
            ),
        );
    }
}

export interface LocationInterface<R = any> {
    latitude: number;
    longitude: number;
    formattedAddress?: string;
    country: string;
    /**
     * ISO 3166-1 alpha-2
     */
    countryCode: string;
    state?: string;
    stateCode?: string;
    city?: string;
    streetName?: string;
    houseNumber?: string;
    postalCode?: string;
    provider: string;
    raw?: R;
}

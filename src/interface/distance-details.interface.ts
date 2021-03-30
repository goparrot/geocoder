export interface DistanceDetailsInterface<ProviderRawEntryType = any> {
    /**
     * in metres
     */
    distance: number;
    /**
     * in seconds
     */
    duration: number;
    provider: string;
    raw?: ProviderRawEntryType;
}

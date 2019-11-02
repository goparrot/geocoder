export interface SuggestionInterface<ProviderRawEntryType = any> {
    formattedAddress: string;
    placeId: string;
    provider: string;
    raw?: ProviderRawEntryType;
}

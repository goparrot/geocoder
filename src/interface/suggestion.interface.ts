export interface SuggestionInterface<R = any> {
    formattedAddress: string;
    placeId: string;
    provider: string;
    raw?: R;
}

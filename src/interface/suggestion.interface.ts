export interface SuggestionInterface<R = any> {
    formattedAddress: string;
    provider: string;
    raw?: R;
}

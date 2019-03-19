export interface HereQueryInterface {
    app_id: string;
    app_code: string;
    gen: number;
    language: string;
    /**
     * limit
     */
    maxresults?: number;
    additionaldata: string;
}

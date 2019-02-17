/**
 * All library exceptions must inherit this class.
 */
export class GeocoderException extends Error {
    constructor(message: string, private readonly payload?: any) {
        super(message);

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    getPayload(): any | undefined {
        return this.payload;
    }
}

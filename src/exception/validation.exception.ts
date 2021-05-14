import { GeocoderException } from './geocoder.exception';
import type { ValidationError } from 'class-validator';

export class ValidationException extends GeocoderException {
    constructor(private readonly errors: ValidationError[]) {
        super('Validation Failed.');
    }

    getValidationErrors(): ValidationError[] {
        return this.errors;
    }
}

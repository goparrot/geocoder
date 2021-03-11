import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { IsExactMatchApplicableConstraint } from './is-exact-match-applicable.constraint';

export function IsExactMatchApplicable(options?: ValidationOptions): any {
    return (object: Record<string, unknown>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            constraints: ['accuracy', 'limit'],
            validator: IsExactMatchApplicableConstraint,
        });
    };
}

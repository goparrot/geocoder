import { registerDecorator } from 'class-validator';
import { IsExactMatchApplicableConstraint } from './is-exact-match-applicable.constraint';
import type { ValidationOptions } from 'class-validator';

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

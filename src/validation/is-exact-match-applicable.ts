import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsExactMatchApplicableConstraint } from './is-exact-match-applicable.constraint';

export function IsExactMatchApplicable(options?: ValidationOptions): any {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            constraints: ['accuracy', 'limit'],
            validator: IsExactMatchApplicableConstraint,
        });
    };
}

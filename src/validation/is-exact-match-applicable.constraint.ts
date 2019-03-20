import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AccuracyEnum } from '../model';

@ValidatorConstraint({ name: 'isExactMatchApplicable' })
export class IsExactMatchApplicableConstraint implements ValidatorConstraintInterface {
    validate(exactMatch: boolean, args: ValidationArguments): boolean {
        const [accuracyProperty, limitProperty]: any = args.constraints;
        const accuracy: AccuracyEnum = (args.object as any)[accuracyProperty];
        const limit: number = (args.object as any)[limitProperty];

        if (!exactMatch) {
            return true;
        }

        if (!accuracy && 'undefined' === typeof limit) {
            return true;
        }

        if (accuracy && AccuracyEnum.HOUSE_NUMBER !== accuracy) {
            return false;
        }

        if (limit && 1 === limit) {
            return false;
        }

        return true;
    }

    defaultMessage(_args: ValidationArguments): string {
        return 'Can be used only if accuracy is not specified or it is set to AccuracyEnum.HOUSE_NUMBER and if limit is not specified or it is more than 1';
    }
}

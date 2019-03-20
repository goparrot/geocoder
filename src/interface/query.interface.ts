import { AccuracyEnum } from '../model';

export interface QueryInterface {
    limit?: number;
    language?: string;
    accuracy?: AccuracyEnum;
    fillMissingQueryProperties?: boolean;
    withRaw?: boolean;
}

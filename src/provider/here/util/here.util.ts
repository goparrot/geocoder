import { AccuracyEnum } from '../../../model';

export function filterByAccuracy({ MatchLevel: matchLevel }: { MatchLevel: string }, accuracy?: AccuracyEnum): boolean {
    if (!accuracy) {
        return true;
    }

    switch (accuracy) {
        case AccuracyEnum.HOUSE_NUMBER:
            return ['houseNumber'].includes(matchLevel);
        case AccuracyEnum.STREET_NAME:
            return ['street'].includes(matchLevel);
        case AccuracyEnum.CITY:
            return ['city'].includes(matchLevel);
        case AccuracyEnum.STATE:
            return ['state'].includes(matchLevel);
        case AccuracyEnum.COUNTRY:
            return ['country'].includes(matchLevel);
    }

    return false;
}

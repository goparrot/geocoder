import { AccuracyEnum } from '../model';

export function sliceFrom(elements: Array<number | string>, searchElement: number | string): Array<number | string> {
    if (!elements.includes(searchElement)) {
        return [];
    }

    return elements.slice(elements.indexOf(searchElement));
}

export function getAvailableAccuracies(maxAccuracy: AccuracyEnum): string[] {
    const accuracies: string[] = Object.values(AccuracyEnum);

    return accuracies.slice(accuracies.indexOf(maxAccuracy));
}

export async function delay(time: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}

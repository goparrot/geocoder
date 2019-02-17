export function sliceFrom(elements: Array<number | string>, searchElement: number | string): Array<number | string> {
    if (!elements.includes(searchElement)) {
        return [];
    }

    return elements.slice(elements.indexOf(searchElement));
}

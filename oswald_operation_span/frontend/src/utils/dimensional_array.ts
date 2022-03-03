
export function lookupFlatIndex<T>(array: Array<T>, index: number, rowLength: number): T {
    return array[Math.floor(index / rowLength)][index % rowLength];
}

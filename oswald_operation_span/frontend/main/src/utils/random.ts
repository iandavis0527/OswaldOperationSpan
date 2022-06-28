export function randomBoolean(): boolean {
    return Math.random() < 0.5;
}

export function randomInRange(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low)
}
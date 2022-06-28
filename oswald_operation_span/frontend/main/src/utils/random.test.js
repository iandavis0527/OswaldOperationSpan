import { randomInRange, randomBoolean } from "./random";

test('random in range generates healthy range', () => {
    let max = null;
    let min = null;
    let numberAboveZero = 0;
    let numberBelowZero = 0;

    for (let i = 0; i < 10000; i++) {
        let randomNumber = randomInRange(-10, 10);

        if (randomNumber < 0) numberBelowZero++;
        else numberAboveZero++;

        if (max == null || randomNumber > max) {
            max = randomNumber;
        }

        if (min == null || randomNumber < min) {
            min = randomNumber;
        }
    }

    expect(max).toBe(10);
    expect(min).toBe(-10);
    expect(numberAboveZero).toBeGreaterThan(4445);
    expect(numberBelowZero).toBeGreaterThan(4445);
});

test("random boolean is close to 50/50", () => {
    let numberFalse = 0;
    let numberTrue = 0;

    for (let i = 0; i < 10000; i++) {
        let randomBool = randomBoolean();

        if (randomBool) numberTrue++;
        else numberFalse++;
    }

    expect(numberTrue).toBeGreaterThan(4445);
    expect(numberFalse).toBeGreaterThan(4445);
})
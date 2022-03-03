import { lookupFlatIndex } from "./dimensional_array";

test("check array indexing", () => {
    const array = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];

    for (let index = 0; index < 9; index++) {
        let actual = lookupFlatIndex(array, index, 3);
        expect(actual).toBe(index + 1);
    }
});
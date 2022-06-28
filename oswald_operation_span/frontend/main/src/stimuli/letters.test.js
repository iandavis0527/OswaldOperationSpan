import { letters, generateLetterSet } from "./letters";

test("ensure letters array is correct", () => {
    const expected = [
        "F", "H", "J",
        "K", "L", "N",
        "P", "Q", "R",
        "S", "T", "Y",
    ];

    expect(letters).toStrictEqual(expected);
});

test("test different set lengths", () => {
    let lengths = [
        1, 4, 6, 14
    ];

    for (let i = 0; i < lengths.length; i++) {
        let length = lengths[i];
        let array = generateLetterSet(length);
        expect(array.length).toBe(length);
    }
});

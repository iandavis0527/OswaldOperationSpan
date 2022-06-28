import generateMathSets from "./math_problems";

const NUMBER_PROBLEMS = 48;

test('ensure varying set lengths', () => {
    let practice_set = generateMathSets([3, 5, 7]);
    expect(practice_set.length).toBe(3);
    expect(practice_set[0].length).toBe(3);
    expect(practice_set[1].length).toBe(5);
    expect(practice_set[2].length).toBe(7);
});

test("ensure set wraps if too many requested", () => {
    let practice_set = generateMathSets([49, 49, 49]);
    expect(practice_set.length).toBe(3);

    expect(practice_set[0].length).toBe(49);
    expect(practice_set[1].length).toBe(49);
    expect(practice_set[2].length).toBe(49);

    expect(practice_set[0][48].operationOne).toStrictEqual(practice_set[0][0].operationOne);
    expect(practice_set[1][48].operationOne).toStrictEqual(practice_set[1][0].operationOne);
    expect(practice_set[2][48].operationOne).toStrictEqual(practice_set[2][0].operationOne);
});

test("ensure no duplicates generated", () => {
    const setLength = NUMBER_PROBLEMS / 4;
    let practice_set = generateMathSets([setLength, setLength, setLength, setLength]);
    let encountered_problems = [];

    expect(practice_set.length).toBe(4);

    for (let i = 0; i < 48; i++) {
        let problem = practice_set[Math.floor(i / setLength)][i % setLength];
        expect(encountered_problems).toEqual(expect.not.arrayContaining([problem]));
        encountered_problems.push(problem);
    }
});

test("ensure zero set lengths", () => {
    let practice_sets = generateMathSets([0]);

    expect(practice_sets.length).toBe(1);
    expect(practice_sets[0].length).toBe(0);
});

test("ensure empty set length", () => {
    let practice_sets = generateMathSets([]);
    expect(practice_sets.length).toBe(0);
});
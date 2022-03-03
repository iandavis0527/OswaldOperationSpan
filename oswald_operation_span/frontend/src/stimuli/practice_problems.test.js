import generatePracticeProblems from "./practice_problems";

test('ensure varying set lengths', () => {
    let practice_set = generatePracticeProblems([3, 5, 7]);
    expect(practice_set.length).toBe(3);
    expect(practice_set[0].length).toBe(3);
    expect(practice_set[1].length).toBe(5);
    expect(practice_set[2].length).toBe(7);
});

test("ensure set wraps if too many requested", () => {
    let practice_set = generatePracticeProblems([17, 17, 17]);
    expect(practice_set.length).toBe(3);
    expect(practice_set[0].length).toBe(17);
    expect(practice_set[1].length).toBe(17);
    expect(practice_set[2].length).toBe(17);
    expect(practice_set[0][16]).toStrictEqual(practice_set[0][0]);
    expect(practice_set[1][16]).toStrictEqual(practice_set[1][0]);
    expect(practice_set[2][16]).toStrictEqual(practice_set[2][0]);
});

test("ensure no duplicates generated", () => {
    let practice_set = generatePracticeProblems([4, 4, 4, 5]);
    let encountered_problems = [];

    expect(practice_set.length).toBe(4);

    for (let i = 0; i < 16; i++) {
        let problem = practice_set[Math.floor(i / 4)][i % 4];
        expect(encountered_problems).toEqual(expect.not.arrayContaining([problem]));
        encountered_problems.push(problem);
    }
});

test("ensure zero set lengths", () => {
    let practice_sets = generatePracticeProblems([0]);

    expect(practice_sets.length).toBe(1);
    expect(practice_sets[0].length).toBe(0);
});

test("ensure empty set length", () => {
    let practice_sets = generatePracticeProblems([]);
    expect(practice_sets.length).toBe(0);
});
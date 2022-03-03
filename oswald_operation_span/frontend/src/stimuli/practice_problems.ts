import PRACTICE_PROBLEMS from "./math_practice_solo.json";
import { randomBoolean, randomInRange } from "../utils/random";
import { shuffle } from "../utils/array_shuffle";

export interface MathPracticeDescription {
    problem: string;
    answer: number;
    correctResponse: boolean;
}

export default function generatePracticeProblems(setLengths: Array<number>): Array < Array < MathPracticeDescription >> {
    let sets: Array<Array<MathPracticeDescription>> = [];
    let randomPractice = shuffle(PRACTICE_PROBLEMS);
    let currentOffset = 0;

    for (let i = 0; i < setLengths.length; i++) {
        let setLength = setLengths[i];
        let set: Array<MathPracticeDescription> = [];

        for (let j = 0; j < setLength; j++) {
            let problem = randomPractice[currentOffset];
            set.push({
                problem: problem.problem,
                answer: problem.answer,
                correctResponse: problem.correctResp === "TRUE",
            });

            currentOffset++;

            if (currentOffset >= randomPractice.length) {
                // Loop around if we go past the length of the array.
                currentOffset = 0;
            }
        }

        sets.push(set);
    }

    return sets;
}

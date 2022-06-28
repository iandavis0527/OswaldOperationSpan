import PRACTICE_PROBLEMS from "./math_practice_solo.json";
import { shuffle } from "../utils/array_shuffle";
import MathProblemDescription from "./problem_description";


export default function generatePracticeProblems(setLengths: Array<number>): Array<Array<MathProblemDescription>> {
    let sets: Array<Array<MathProblemDescription>> = [];
    let randomPractice = shuffle(PRACTICE_PROBLEMS);
    let currentOffset = 0;

    for (let i = 0; i < setLengths.length; i++) {
        let setLength = setLengths[i];
        let set: Array<MathProblemDescription> = [];

        for (let j = 0; j < setLength; j++) {
            let problem = randomPractice[currentOffset];

            set.push({
                problem: problem.problem,
                prompt: problem.answer,
                expectedAnswer: problem.correctResp === "TRUE",
                difficulty: "1",
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

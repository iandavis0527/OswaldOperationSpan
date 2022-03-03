import { shuffle } from "../utils/array_shuffle";
import { randomBoolean, randomInRange } from "../utils/random";
import OPERATION_ONE from "./math_operation_one_stimuli.json";
import OPERATION_TWO from "./math_operation_two_stimuli.json";

export interface MathProblemDescription {
    operationOne: string;
    operationTwo: string;
    sum: number;
    expectedAnswer: boolean;
    difficulty: string;
}

export default function generateMathSets(setLengths: Array<number>): Array<Array<MathProblemDescription>> {
    let sets: Array<Array<MathProblemDescription>> = [];
    let firstOperation = shuffle(OPERATION_ONE);
    let secondOperation = shuffle(OPERATION_TWO);
    let currentOffset = 0;
    let currentOffset2 = 0;

    for (let i = 0; i < setLengths.length; i++) {
        let setLength = setLengths[i];
        let set: Array<MathProblemDescription> = [];

        for (let j = 0; j < setLength; j++) {
            let op1 = firstOperation[currentOffset];
            let op2 = secondOperation[currentOffset2];
            let answer = op1.sum + op2.sum;

            let isCorrect = randomBoolean();

            if (!isCorrect) {
                answer += randomInRange(-9, 9);
            }

            set.push({
                operationOne: op1.op1,
                operationTwo: op2.op2,
                sum: answer,
                expectedAnswer: isCorrect,
                difficulty: op1.difficulty,
            });
            currentOffset++;
            currentOffset2++;

            if (currentOffset >= firstOperation.length) {
                currentOffset = 0;
            }

            if (currentOffset2 >= secondOperation.length) {
                currentOffset2 = 0;
            }
        }

        sets.push(set);
    }

    return sets;
}

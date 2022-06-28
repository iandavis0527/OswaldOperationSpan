import { ExperimentState, ExperimentStateType } from "./ExperimentState";


export class ShowingMathProblem extends ExperimentState {
    readonly mathProblem: string;
    readonly maxReadingTime?: number;

    constructor(mathProblem: string, maxReadingTime?: number) {
        super(ExperimentStateType.SHOWING_MATH);
        this.mathProblem = mathProblem;
        this.maxReadingTime = maxReadingTime;
    }
}

export class ShowingMathAnswer extends ExperimentState {
    readonly prompt: string;

    constructor(prompt: string) {
        super(ExperimentStateType.SHOWING_ANSWER); 
        this.prompt = prompt;
    }
}

export class ShowingFeedbackState extends ExperimentState {
    readonly operationOne: string;
    readonly operationTwo: string;
    readonly operand: string;
    readonly correct: boolean;

    constructor(operationOne: string, operationTwo: string, operand: string, correct: boolean) {
        super(ExperimentStateType.MATH_FEEDBACK);
        this.operationOne = operationOne;
        this.operationTwo = operationTwo;
        this.operand = operand;
        this.correct = correct;
    }
}

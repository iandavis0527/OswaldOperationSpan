import { ExperimentState, ExperimentStateType } from "./ExperimentState";


export class ShowingProblemState extends ExperimentState {
    readonly mathProblem: string;
    readonly maxReadingTime?: number;

    constructor(mathProblem: string, maxReadingTime?: number) {
        super(ExperimentStateType.SHOWING_MATH);
        this.mathProblem = mathProblem;
        this.maxReadingTime = maxReadingTime;
    }
}

export class ShowingAnswerState extends ExperimentState {
    readonly prompt: string;

    constructor(prompt: string) {
        super(ExperimentStateType.SHOWING_ANSWER); 
        this.prompt = prompt;
    }
}

export class ShowingFeedbackState extends ExperimentState {
    readonly correct: boolean;

    constructor(correct: boolean) {
        super(ExperimentStateType.MATH_FEEDBACK);
        this.correct = correct;
    }
}

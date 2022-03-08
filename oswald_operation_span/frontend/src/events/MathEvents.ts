import { ExperimentEvent, ExperimentEventType } from "./ExperimentEvent";


export class ShowMathEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.SHOW_MATH);
    }
}

export class MathReadEvent extends ExperimentEvent {
    readonly readingTime: number;

    constructor(readingTime: number) {
        super(ExperimentEventType.MATH_READ);
        this.readingTime = readingTime;
    }
}

export class MathProblemRespondedEvent extends ExperimentEvent {
    readonly answer: boolean;

    constructor(answer: boolean) {
        super(ExperimentEventType.MATH_PROBLEM_RESPONDED);
        this.answer = answer;
    }
}

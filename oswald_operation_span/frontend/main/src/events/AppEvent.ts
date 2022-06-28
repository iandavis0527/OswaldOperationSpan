import { LetterResult } from "../results/LetterResult";
import MathResult from "../results/MathResult";

export enum AppEventType {
    FINISHED_PRACTICE_LETTERS,
    FINISHED_PRACTICE_MATH,
    FINISHED_PRACTICE_BOTH,
    FINISHED_EXPERIMENT,
}

export abstract class AppEvent {
    readonly eventType: AppEventType;

    protected constructor(eventType: AppEventType) {
        this.eventType = eventType;
    }
}

export class FinishedPracticeLettersEvent extends AppEvent {
    readonly result: LetterResult;

    constructor(result: LetterResult) {
        super(AppEventType.FINISHED_PRACTICE_LETTERS);

        this.result = result;
    }
}

export class FinishedPracticeMathEvent extends AppEvent {
    readonly result: MathResult;

    constructor(result: MathResult) {
        super(AppEventType.FINISHED_PRACTICE_MATH);
        this.result = result;
    }
}

export class FinishedPracticeBothEvent extends AppEvent {
    readonly MathResult: MathResult;
    readonly letterResult: LetterResult;
    readonly maxReadingTime: number;

    constructor(MathResult: MathResult, letterResult: LetterResult, maxReadingTime: number) {
        super(AppEventType.FINISHED_PRACTICE_BOTH);

        this.MathResult = MathResult;
        this.letterResult = letterResult;
        this.maxReadingTime = maxReadingTime;
    }
}

export class FinishedExperimentEvent extends AppEvent {
    readonly mathResult: MathResult;
    readonly letterResult: LetterResult;

    constructor(mathResult: MathResult, letterResult: LetterResult) {
        super(AppEventType.FINISHED_EXPERIMENT);

        this.mathResult = mathResult;
        this.letterResult = letterResult;
    }
}

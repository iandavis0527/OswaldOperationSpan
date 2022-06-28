import { SetFinishedEvent } from "../events/ExperimentEvent";

export enum ExperimentStateType {
    LETTER_INSTRUCTIONS1,
    LETTER_INSTRUCTIONS2,
    LETTER_INSTRUCTIONS3,
    MATH_INSTRUCTIONS1,
    MATH_INSTRUCTIONS2,
    MATH_INSTRUCTIONS3,
    COMBINED_INSTRUCTIONS1,
    COMBINED_INSTRUCTIONS2,
    COMBINED_INSTRUCTIONS3,
    EXPERIMENT_START_SCREEN,
    SHOWING_MATH,
    SHOWING_ANSWER,
    SHOWING_LETTER,
    MATH_FEEDBACK,
    HIDING_LETTER,
    SHOWING_GRID,
    SHOWING_LETTER_PRACTICE_FEEDBACK,
    ISI_DELAY,
    SET_FEEDBACK,
}

export abstract class ExperimentState {
    readonly stateType: ExperimentStateType;

    protected constructor(stateType: ExperimentStateType) {
        this.stateType = stateType;
    }
}

export class ISIDelayState extends ExperimentState {
    constructor() {
        super(ExperimentStateType.ISI_DELAY);
    }
}

export class SetFeedbackState extends ExperimentState {
    readonly percentCorrect: number;
    readonly mathErrors: number;
    readonly setSize: number;
    readonly lettersCorrect: number;

    constructor(event: SetFinishedEvent) {
        super(ExperimentStateType.SET_FEEDBACK);
        this.setSize = event.setSize;
        this.mathErrors = event.mathErrors;
        this.lettersCorrect = event.lettersCorrect;
        this.percentCorrect = event.percentCorrect;
    }
}
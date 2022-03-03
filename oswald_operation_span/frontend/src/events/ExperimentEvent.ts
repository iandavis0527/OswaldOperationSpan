export enum ExperimentEventType {
    LETTER_INSTRUCTIONS1_CLICKED,
    LETTER_INSTRUCTIONS2_CLICKED,
    LETTER_PRACTICE_STARTED,
    SHOW_LETTER,
    HIDE_LETTER,
    SHOW_GRID,
    GRID_CONFIRMED,
    MATH_INSTRUCTIONS1_CLICKED,
    MATH_INSTRUCTIONS2_CLICKED,
    MATH_PRACTICE_STARTED,
    SHOW_MATH,
    MATH_READ,
    MATH_TIMED_OUT,
    SENSE_PROMPT_RESPONDED,
    COMBINED_INSTRUCTIONS1_CLICKED,
    COMBINED_INSTRUCTIONS2_CLICKED,
    COMBINED_INSTRUCTIONS3_CLICKED,
    ISI_DELAY,
    SET_FINISHED,
    START_PRACTICE_BOTH,
    START_EXPERIMENT,
    EXPERIMENT_START_CLICKED,
}

export class ExperimentEvent {
    readonly eventType: ExperimentEventType;

    constructor(eventType: ExperimentEventType) {
        this.eventType = eventType;
    }
}

export class ISIDelayEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.ISI_DELAY);
    }
}

export class SetFinishedEvent extends ExperimentEvent {
    readonly percentCorrect: number;
    readonly lettersCorrect: number;
    readonly setSize: number;
    readonly mathErrors: number;

    constructor(percentCorrect: number, lettersCorrect: number, setSize: number, mathErrors: number) {
        super(ExperimentEventType.SET_FINISHED);
        this.percentCorrect = percentCorrect;
        this.lettersCorrect = lettersCorrect;
        this.setSize = setSize;
        this.mathErrors = mathErrors;
    }
}

export class StartPracticeBothEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.START_PRACTICE_BOTH);
    }
}

export class StartExperimentEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.START_EXPERIMENT);
    }
}

import {ExperimentEvent, ExperimentEventType} from "./ExperimentEvent";

export class MathPracticeStartedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.SENTENCE_PRACTICE_STARTED);
    }
}

export class ShowMathEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;

    constructor(sentence: string, expectedResponse: boolean) {
        super(ExperimentEventType.SHOW_SENTENCE);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
    }
}

export class MathReadEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, readingTimeMillis: number) {
        super(ExperimentEventType.SENTENCE_READ);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.readingTimeMillis = readingTimeMillis;
    }
}

export class MathTimeoutEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;

    constructor(sentence: string, expectedResponse: boolean) {
        super(ExperimentEventType.SENTENCE_TIMED_OUT);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
    }
}

export class SensePromptRespondedEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly response: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, response: boolean, readingTimeMillis: number) {
        super(ExperimentEventType.SENSE_PROMPT_RESPONDED);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.response = response;
        this.readingTimeMillis = readingTimeMillis;
    }
}

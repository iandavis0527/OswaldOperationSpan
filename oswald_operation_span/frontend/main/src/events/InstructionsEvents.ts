import {ExperimentEvent, ExperimentEventType} from "./ExperimentEvent";

export class LetterInstructions1ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.LETTER_INSTRUCTIONS1_CLICKED);
    }
}

export class LetterInstructions2ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.LETTER_INSTRUCTIONS2_CLICKED);
    }
}

export class MathInstructions1ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.MATH_INSTRUCTIONS1_CLICKED);
    }
}

export class MathInstructions2ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.MATH_INSTRUCTIONS2_CLICKED);
    }
}

export class MathInstructions3ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.MATH_INSTRUCTIONS3_CLICKED);
    }
}

export class CombinedInstructions1ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.COMBINED_INSTRUCTIONS1_CLICKED);
    }
}

export class CombinedInstructions2ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.COMBINED_INSTRUCTIONS2_CLICKED);
    }
}

export class CombinedInstructions3ClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.COMBINED_INSTRUCTIONS3_CLICKED);
    }
}

export class ExperimentStartScreenClickedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.EXPERIMENT_START_CLICKED);
    }
}
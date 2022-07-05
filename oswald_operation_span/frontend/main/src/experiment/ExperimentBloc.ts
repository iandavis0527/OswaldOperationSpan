import {Bloc} from "@felangel/bloc";
import {
    ExperimentEvent,
    ExperimentEventType,
    ISIDelayEvent,
    SetFinishedEvent,
    StartExperimentEvent,
    StartPracticeBothEvent,
} from "../events/ExperimentEvent";
import {ExperimentState, SetFeedbackState, ISIDelayState} from "../states/ExperimentState";
import {AppBloc} from "../AppBloc";
import {
    CombinedInstructions1State,
    CombinedInstructions2State,
    CombinedInstructions3State, ExperimentStartScreenState
} from "../states/InstructionsStates";
import {shuffle} from "../utils/array_shuffle";
import {MathProblemRespondedEvent, MathReadEvent, ShowMathEvent} from "../events/MathEvents";
import {ShowingProblemState, ShowingAnswerState, ShowingFeedbackState} from "../states/MathStates";
import MathResult from "../results/MathResult";
import {LetterResult} from "../results/LetterResult";
import {GridConfirmedEvent, ShowGridEvent, ShowLetterEvent} from "../events/LetterEvents";
import {wait} from "../utils/async";
import {generateLetterSet} from "../stimuli/letters";
import generateMathSets from "../stimuli/math_problems";
import {ShowingGridState, ShowingLetterState} from "../states/LetterStates";
import {FinishedExperimentEvent, FinishedPracticeBothEvent} from "../events/AppEvent";
import MathProblemDescription from "../stimuli/problem_description";

// Practice shows 2 sets of 2 maths and letters.
// Experiment shows 6 sets -- 2 of length 4, 2 of length 5 and 2 of length 6.
// Total number of individual trials for the exp: 30.
// Assuming an average reading time of 10 seconds (?) and average letter sequence choosing time of 5 seconds (?),
// experiment could take about 7.5 minutes.

export class ExperimentBloc extends Bloc<ExperimentEvent, ExperimentState> {
    private readonly appBloc: AppBloc;

    private maxReadingTime: number = -1;
    private practice: boolean = false;

    private mathSets: Array<Array<MathProblemDescription>> = [];
    private letterSets: Array<Array<string>> = [];
    private currentSetIndex: number = 0;
    private currentSetOffset: number = 0;
    private currentMathProblem: MathProblemDescription = {problem: "", prompt: 0, expectedAnswer: true, difficulty: '15'};
    private currentMathReadingTime: number = 0;

    private mathsResult: MathResult = new MathResult();
    private lettersResult: LetterResult = new LetterResult();

    private currentTrialMathErrors: number = 0;

    constructor(appBloc: AppBloc,
                initialState: ExperimentState = new CombinedInstructions1State(),) {
        super(initialState);
        this.appBloc = appBloc;
    }

    reset(practice: boolean, maxReadingTime: number) {
        this.maxReadingTime = maxReadingTime;
        console.debug("Max reading time for this portion: " + this.maxReadingTime);
        this.practice = practice;
        this.mathSets = [];
        this.letterSets = [];
        this.mathsResult = new MathResult();
        this.lettersResult = new LetterResult();
        this.currentSetIndex = 0;
        this.currentSetOffset = 0;
        this.currentMathReadingTime = 0;

        if (practice) {
            this.generatePracticeSets();
            this.add(new StartPracticeBothEvent());
        } else {
            this.generateExperimentSets();
            this.add(new StartExperimentEvent());
        }

        this.currentMathProblem = this.mathSets[this.currentSetIndex][this.currentSetOffset];

        console.assert(this.mathSets.length === this.letterSets.length);
    }

    async* mapEventToState(event: ExperimentEvent): AsyncIterableIterator<ExperimentState> {
        switch (event.eventType) {
            case ExperimentEventType.START_PRACTICE_BOTH:
                yield new CombinedInstructions1State();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS1_CLICKED:
                yield new CombinedInstructions2State();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS2_CLICKED:
                yield new CombinedInstructions3State();
                break;
            case ExperimentEventType.START_EXPERIMENT:
                yield new ExperimentStartScreenState();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS3_CLICKED:
            case ExperimentEventType.EXPERIMENT_START_CLICKED:
                this.nextTrial().then();
                break;
            case ExperimentEventType.SHOW_MATH:
                yield new ShowingProblemState(this.currentMathProblem.problem, this.maxReadingTime);
                break;
            case ExperimentEventType.MATH_READ:
                let readEvent = (event as MathReadEvent);
                this.currentMathReadingTime = readEvent.readingTime;
                yield new ShowingAnswerState(this.currentMathProblem.prompt.toString());
                break;
            case ExperimentEventType.MATH_TIMED_OUT:
                // let timedOutEvent = (event as MathTimeoutEvent);
                // TODO: Add the timeout event to the maths result.
                this.showLetter().then();
                break;
            case ExperimentEventType.MATH_PROBLEM_RESPONDED:
                let responseEvent = (event as MathProblemRespondedEvent);
                console.debug("adding math input to result");
                this.mathsResult.addInput(
                    this.currentMathProblem.problem,
                    this.currentMathProblem.prompt,
                    this.currentMathProblem.expectedAnswer,
                    responseEvent.answer,
                    this.currentMathReadingTime);

                if (responseEvent.answer !== this.currentMathProblem.expectedAnswer) {
                    console.debug("Incorrect response, upping number of math errors");
                    this.currentTrialMathErrors++;
                }

                this.showLetter().then();
                break;
            case ExperimentEventType.ISI_DELAY:
                yield new ISIDelayState();
                break;
            case ExperimentEventType.SHOW_LETTER:
                let letterEvent = (event as ShowLetterEvent);
                yield new ShowingLetterState(letterEvent.letter);
                break;
            case ExperimentEventType.SHOW_GRID:
                yield new ShowingGridState();
                break;
            case ExperimentEventType.GRID_CONFIRMED:
                let gridEvent = (event as GridConfirmedEvent);
                this.confirmGrid(gridEvent).then();
                break;
            case ExperimentEventType.SET_FINISHED:
                yield new SetFeedbackState((event as SetFinishedEvent));
                break;
        }
    }

    async nextTrial() {
        if (this.currentSetIndex >= this.mathSets.length) {
            if (this.practice) {
                this.appBloc.add(new FinishedPracticeBothEvent(this.mathsResult, this.lettersResult, this.maxReadingTime));
            } else {
                this.appBloc.add(new FinishedExperimentEvent(this.mathsResult, this.lettersResult));
            }
            return;
        }

        if (this.currentSetOffset >= this.mathSets[this.currentSetIndex].length) {
            this.add(new ShowGridEvent());
            return;
        }

        await this.showMath().then();
    }

    async showMath() {
        this.currentMathProblem = this.mathSets[this.currentSetIndex][this.currentSetOffset];
        this.add(new ShowMathEvent());
    }

    async showLetter() {
        let letter = this.letterSets[this.currentSetIndex][this.currentSetOffset];

        this.add(new ISIDelayEvent());
        await wait(200);

        this.add(new ShowLetterEvent(letter));
        await wait(1000);

        this.add(new ISIDelayEvent());
        await wait(250);

        this.currentSetOffset++;
        await this.nextTrial();
    }

    async confirmGrid(event: GridConfirmedEvent) {
        let chosenLetters = event.letterOrder;
        let expectedLetters = this.letterSets[this.currentSetIndex];
        this.lettersResult.addInputs(expectedLetters, chosenLetters);

        this.currentSetOffset = 0;
        this.currentSetIndex++;

        let numberCorrectLetters = 0;

        let length = Math.min(chosenLetters.length, expectedLetters.length);

        for (let i=0; i < length; i++) {
            let chosenLetter = chosenLetters[i];
            let expectedLetter = expectedLetters[i];

            if (chosenLetter === expectedLetter) {
                numberCorrectLetters++;
            }
        }

        console.debug("number math trial errors: " + this.currentTrialMathErrors);

        this.add(new SetFinishedEvent(
            this.mathsResult.percentCorrect(),
            numberCorrectLetters,
            expectedLetters.length,
            this.currentTrialMathErrors));

        this.currentTrialMathErrors = 0;

        await wait(2000);
        this.add(new ISIDelayEvent());
        await wait(1000);
        await this.nextTrial();
    }

    generatePracticeSets() {
        this.mathSets = generateMathSets([2, 2], this.practice);

        console.debug(this.mathSets);

        for (let i=0; i < 2; i++) {
            this.letterSets.push(generateLetterSet(2));
        }

        this.mathSets = shuffle(this.mathSets);
        this.letterSets = shuffle(this.letterSets);
    }

    generateExperimentSets() {
        let setLengths = [4, 4, 5, 5, 6, 6];
        setLengths = shuffle(setLengths);

        this.mathSets = generateMathSets(setLengths);

        console.debug(this.mathSets);

        for (let i=0; i < 6; i++) {
            let setLength = setLengths[i];
            this.letterSets.push(generateLetterSet(setLength));
        }
    }
}

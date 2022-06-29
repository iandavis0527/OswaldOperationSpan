import {Bloc} from "@felangel/bloc";
import {AppBloc} from "../AppBloc";
import {ExperimentState, ISIDelayState} from "../states/ExperimentState";
import {
    MathInstructions1State, MathInstructions2State, MathInstructions3State
} from "../states/InstructionsStates";
import {ExperimentEvent, ExperimentEventType} from "../events/ExperimentEvent";
import MathResult from "../results/MathResult";
import { MathFeedbackOverEvent, MathFeedbackStartedEvent, MathProblemRespondedEvent, ShowMathEvent, MathReadEvent } from "../events/MathEvents";
import { ShowingProblemState, ShowingFeedbackState, ShowingAnswerState } from "../states/MathStates";
import MathProblemDescription from "../stimuli/problem_description";
import generatePracticeProblems from "../stimuli/practice_problems";
import { wait } from "../utils/async";
import { FinishedPracticeMathEvent } from "../events/AppEvent";

export class PracticeMathBloc extends Bloc<ExperimentEvent, ExperimentState> {
    private cycles: number = 16;
    private currentIndex: number = 0;
    private practiceProblems: Array<MathProblemDescription>;
    private currentPracticeProblem: MathProblemDescription;
    private result: MathResult = new MathResult();
    private appBloc: AppBloc;
    private readingTime: number = 0;
    private answerCorrect: boolean = false;

    constructor(appBloc: AppBloc, initialState: ExperimentState = new MathInstructions1State()) {
        super(initialState);
        this.appBloc = appBloc;
        // Generate an array of 16 practice problems.
        this.practiceProblems = generatePracticeProblems([16])[0];
        this.currentPracticeProblem = this.practiceProblems[0];
    }

    async* mapEventToState(event: ExperimentEvent): AsyncIterableIterator<ExperimentState> {
        switch (event.eventType) {
            case ExperimentEventType.MATH_INSTRUCTIONS1_CLICKED:
                yield new MathInstructions2State();
                break;
            case ExperimentEventType.MATH_INSTRUCTIONS2_CLICKED:
                yield new MathInstructions3State();
                break;
            case ExperimentEventType.MATH_INSTRUCTIONS3_CLICKED:
                this.add(new ShowMathEvent());
                break;
            case ExperimentEventType.SHOW_MATH:
                yield new ShowingProblemState(this.currentPracticeProblem.problem);
                break;
            case ExperimentEventType.MATH_READ:
                this.readingTime = (event as MathReadEvent).readingTime;
                yield new ISIDelayState();
                await wait(200);
                yield new ShowingAnswerState(this.currentPracticeProblem.prompt.toString());
                break;
            case ExperimentEventType.MATH_PROBLEM_RESPONDED:
                this.onMathProblemResponded((event as MathProblemRespondedEvent));
                break;
            case ExperimentEventType.MATH_FEEDBACK_STARTED:
                yield new ShowingFeedbackState(this.answerCorrect);
                break;
            case ExperimentEventType.MATH_FEEDBACK_OVER:
                yield new ISIDelayState();
                break;
        }
    }

    async onMathProblemResponded(event: MathProblemRespondedEvent) {
        this.answerCorrect = event.answer === this.currentPracticeProblem.expectedAnswer;
        this.add(new MathFeedbackStartedEvent());
        this.result.addMathProblem(this.currentPracticeProblem, event.answer, this.readingTime);
        this.currentPracticeProblem = this.getNextProblem();
        this.readingTime = 0;
        await wait(500);
        this.add(new MathFeedbackOverEvent());
        await wait(500);

        if (this.currentIndex >= this.practiceProblems.length) {
            this.appBloc.add(new FinishedPracticeMathEvent(this.result));
        } else {
            this.add(new ShowMathEvent());
        }
    }

    getNextProblem(): MathProblemDescription {
        return this.practiceProblems[++this.currentIndex % this.practiceProblems.length];
    }
}

import { BlocBuilder } from "@felangel/react-bloc";
import {
    ExperimentState,
    ExperimentStateType,
} from "../states/ExperimentState";
import {
    ShowingAnswerState,
    ShowingFeedbackState,
    ShowingProblemState,
} from "../states/MathStates";

import * as screen from "./screens.js";

export default function MathBlocBuilder(props: Record<string, any>) {
    return (
        <BlocBuilder
            bloc={props.bloc}
            builder={(state: ExperimentState) => {
                console.debug(
                    "Math bloc builder got new state: " +
                        ExperimentStateType[state.stateType]
                );
                switch (state.stateType) {
                    case ExperimentStateType.MATH_INSTRUCTIONS1:
                        return <screen.MathInstructions1 bloc={props.bloc} />;
                    case ExperimentStateType.MATH_INSTRUCTIONS2:
                        return <screen.MathInstructions2 bloc={props.bloc} />;
                    case ExperimentStateType.MATH_INSTRUCTIONS3:
                        return <screen.MathInstructions3 bloc={props.bloc} />;
                    case ExperimentStateType.SHOWING_MATH:
                        return (
                            <screen.MathView
                                problem={
                                    (state as ShowingProblemState).mathProblem
                                }
                                maxReadingTime={
                                    (state as ShowingProblemState)
                                        .maxReadingTime
                                }
                                bloc={props.bloc}
                            />
                        );
                    case ExperimentStateType.SHOWING_ANSWER:
                        return (
                            <screen.MathAnswerView
                                answer={(state as ShowingAnswerState).prompt}
                                bloc={props.bloc}
                            />
                        );
                    case ExperimentStateType.ISI_DELAY:
                        return <div className={"isi-delay-container"} />;
                    case ExperimentStateType.MATH_FEEDBACK:
                        return (
                            <screen.MathFeedbackView
                                feedback={
                                    (state as ShowingFeedbackState).correct
                                }
                                bloc={props.bloc}
                            />
                        );
                    default:
                        return <p>Unknown math state {state.stateType}</p>;
                }
            }}
        />
    );
}

import React from "react";
import { BlocBuilder } from "@felangel/react-bloc";
import "../css/letters-task.css";
import { ShowingLetterState } from "../states/LetterStates";
import {
    ExperimentState,
    ExperimentStateType,
} from "../states/ExperimentState";
import LetterGridView from "../letters/LetterGridView";
import LetterView from "../letters/LetterView";
import CombinedInstructions1 from "./CombinedInstructions1";
import CombinedInstructions2 from "./CombinedInstructions2";
import CombinedInstructions3 from "./CombinedInstructions3";
import ExperimentStartScreen from "./ExperimentStartScreen";
import {
    ShowingAnswerState,
    ShowingFeedbackState,
    ShowingProblemState,
} from "../states/MathStates";

import * as screen from "../math/screens.js";

export default function ExperimentBlocBuilder(props: Record<string, any>) {
    return (
        <BlocBuilder
            bloc={props.bloc}
            builder={(state: ExperimentState) => {
                switch (state.stateType) {
                    case ExperimentStateType.EXPERIMENT_START_SCREEN:
                        return <ExperimentStartScreen bloc={props.bloc} />;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS1:
                        return <CombinedInstructions1 bloc={props.bloc} />;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS2:
                        return <CombinedInstructions2 bloc={props.bloc} />;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS3:
                        return <CombinedInstructions3 bloc={props.bloc} />;
                    case ExperimentStateType.SHOWING_LETTER:
                        return (
                            <LetterView
                                letter={(state as ShowingLetterState).letter}
                            />
                        );
                    case ExperimentStateType.HIDING_LETTER:
                        return <div />;
                    case ExperimentStateType.SHOWING_GRID:
                        return <LetterGridView bloc={props.bloc} />;
                    case ExperimentStateType.ISI_DELAY:
                        return <div id={"isi-delay-container"} />;
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
                        return (
                            <p>
                                Unknown experiment state{" "}
                                {ExperimentStateType[state.stateType]}
                            </p>
                        );
                }
            }}
        />
    );
}

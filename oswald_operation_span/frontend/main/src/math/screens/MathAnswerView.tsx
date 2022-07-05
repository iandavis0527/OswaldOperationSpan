import autoBind from "auto-bind";
import React from "react";

import "../../css/math/math_answer_view.css";
import { MathProblemRespondedEvent } from "../../events/MathEvents";

interface MathAnswerProperties {
    answer: string;
    bloc: any;
}

export class MathAnswerView extends React.Component<MathAnswerProperties> {
    constructor(props: MathAnswerProperties) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <div className={"math-answer-container"}>
                <div className={"math-answer-prompt"}>{this.props.answer}</div>
                <div className={"math-answer-response-container"}>
                    <div
                        className={"math-answer-response-button"}
                        onClick={() => this.onPromptAnswered(true)}
                    >
                        TRUE
                    </div>
                    <div
                        className={"math-answer-response-button"}
                        onClick={() => this.onPromptAnswered(false)}
                    >
                        FALSE
                    </div>
                </div>
            </div>
        );
    }

    onPromptAnswered(response: boolean) {
        this.props.bloc.add(new MathProblemRespondedEvent(response));
    }
}

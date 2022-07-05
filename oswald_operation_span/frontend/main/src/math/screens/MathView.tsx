import "../../css/math/math_problem_view.css";
import autoBind from "auto-bind";
import React from "react";
import { MathReadEvent } from "../../events/MathEvents";

interface MathViewProperties {
    problem: string;
    maxReadingTime?: number;
    bloc: any;
}

export class MathView extends React.Component<MathViewProperties> {
    private readingTimeStart: Date;

    constructor(props: MathViewProperties) {
        super(props);
        autoBind(this);
        this.readingTimeStart = new Date();
    }

    componentDidMount() {
        this.readingTimeStart = new Date();
    }

    render() {
        return (
            <div
                className={"math-view-container"}
                onClick={this.onContainerClicked}
            >
                <div className={"math-problem-container"}>
                    {this.props.problem}
                </div>
                <div className={"math-continue-prompt"}>
                    When you have solved the math problem, click the mouse to
                    continue
                </div>
            </div>
        );
    }

    onContainerClicked() {
        this.props.bloc.add(
            new MathReadEvent(
                new Date().getTime() - this.readingTimeStart.getTime()
            )
        );
    }
}

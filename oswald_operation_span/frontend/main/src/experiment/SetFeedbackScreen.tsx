import React from "react";
import "../css/set_feedback_screen.css";

interface SetFeedbackProperties {
    percentageCorrect: number;
    lettersCorrect: number;
    problemsCorrect: number;
    setSize: number;
}

export class SetFeedbackScreen extends React.Component<SetFeedbackProperties> {
    render() {
        return (
            <div className={"set-feedback-container"}>
                <div className={"set-feedback-percentage"}>
                    {Math.floor(this.props.percentageCorrect)}%
                </div>
                <div className={"set-feedback-letters"}>
                    You recalled {this.props.lettersCorrect} letters correctly
                    out of {this.props.setSize}
                </div>
                <div className={"set-feedback-problems"}>
                    You calculated {this.props.problemsCorrect} problems
                    correctly out of {this.props.setSize}.
                </div>
            </div>
        );
    }
}

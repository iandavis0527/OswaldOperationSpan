import React from "react";

import "../../css/math/math_feedback_view.css";

interface MathFeedbackProperties {
    feedback: boolean;
    bloc: any;
}

export class MathFeedbackView extends React.Component<MathFeedbackProperties> {
    render() {
        return (
            <div className={"math-feedback-container"}>
                <div className={"math-feedback"}>
                    {this.props.feedback ? "Correct" : "Incorrect"}
                </div>
            </div>
        );
    }
}

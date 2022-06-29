import React from "react";
import "../../css/instructions.css";
import InstructionsPage from "../../components/InstructionsPage";
import { MathInstructions2ClickedEvent } from "../../events/InstructionsEvents";

export class MathInstructions2 extends React.Component {
    constructor(props) {
        super(props);

        this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
    }

    render() {
        return (
            <InstructionsPage
                onInstructionsClicked={this.onInstructionsClicked}
                continuePrompt={"Click in this box to continue."}
                title={"INSTRUCTIONS"}
                paragraphs={[
                    "In this portion of the experiment you will try to memorize letters you see on the screen while you also read sentences.",
                    "In the next few minutes, you will have some practice to get you familiar with how the task works.",
                ]}
            />
        );
    }

    onInstructionsClicked() {
        this.props.bloc.add(new MathInstructions2ClickedEvent());
    }
}

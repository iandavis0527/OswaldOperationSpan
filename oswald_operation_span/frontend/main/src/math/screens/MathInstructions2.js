import React from "react";
import "../../css/instructions/instructions.css";
import "../../css/instructions/mathinstructions2.css";
import InstructionsPage from "../../components/InstructionsPage";
import { MathInstructions2ClickedEvent } from "../../events/InstructionsEvents";
import instruction_texts from "../../stimuli/instruction_texts";

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
                paragraphs={instruction_texts.PractMathInst2}
                minContainerHeight={800}
            />
        );
    }

    onInstructionsClicked() {
        this.props.bloc.add(new MathInstructions2ClickedEvent());
    }
}

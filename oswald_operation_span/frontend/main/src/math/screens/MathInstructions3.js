import React from "react";
import "../../css/instructions/instructions.css";
import InstructionsPage from "../../components/InstructionsPage";
import { MathInstructions3ClickedEvent } from "../../events/InstructionsEvents";
import instruction_texts from "../../stimuli/instruction_texts";

export class MathInstructions3 extends React.Component {
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
                paragraphs={instruction_texts.PractMathInst3}
                minContainerHeight={200}
            />
        );
    }

    onInstructionsClicked() {
        this.props.bloc.add(new MathInstructions3ClickedEvent());
    }
}

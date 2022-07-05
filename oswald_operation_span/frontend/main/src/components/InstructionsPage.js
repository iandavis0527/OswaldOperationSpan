export default function InstructionsPage(props) {
    let paragraphs = [];

    for (let i = 0; i < props.paragraphs.length; i++) {
        paragraphs.push(
            <div
                className={"instructions-paragraph"}
                id={"instruction-paragraph-" + i}
                key={i}
            >
                {props.paragraphs[i]}
            </div>
        );
    }

    let continuePrompt = "";
    let containerOnClick = () => {};

    if (props.continueButton !== undefined && props.continueButton !== null) {
        continuePrompt = props.continueButton;
    } else if (
        props.continuePrompt !== undefined &&
        props.continuePrompt !== null
    ) {
        continuePrompt = (
            <div
                className={
                    "instructions-paragraph instructions-continue-prompt"
                }
                onClick={props.onInstructionsClicked}
            >
                <div className={"instructions-continue-text"}>
                    {props.continuePrompt}
                </div>
            </div>
        );
    } else {
        containerOnClick = props.onInstructionsClicked;
    }

    let title = "";

    if (
        props.title !== undefined &&
        props.title !== null &&
        props.title !== ""
    ) {
        title = <h1 className={"instructions-title"}>{props.title}</h1>;
    }

    let additionalContainerClasses = "";

    if (
        props.additionalContainerClasses !== undefined &&
        props.additionalContainerClasses !== null
    ) {
        additionalContainerClasses = props.additionalContainerClasses;
    }

    let minContainerHeight = 0;

    if (props.minContainerHeight !== undefined) {
        minContainerHeight = props.minContainerHeight;
    }

    return (
        <div
            className={
                "instructions-container fullscreen-centered-container " +
                additionalContainerClasses
            }
            id={"practice-letter-instructions-container"}
            onClick={containerOnClick}
            style={{ minHeight: minContainerHeight }}
        >
            {title}
            {paragraphs}
            {continuePrompt}
        </div>
    );
}

import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";
import "./css/App.scss";

import { AppBloc } from "./AppBloc";
import { BlocBuilder } from "@felangel/react-bloc";
import { PracticeLetterBloc } from "./letters/PracticeLetterBloc";

import {
    AppState,
    AppStateType,
    PracticeBothState,
    PracticeLettersState,
    PracticeMathState,
    RunningExperimentState,
    UploadingExperimentState,
} from "./states/AppState";
import { ExperimentState } from "./states/ExperimentState";

import packageInfo from "../package.json";

import LetterBlocBuilder from "./letters/LetterBlocBuilder";
import ExperimentBlocBuilder from "./experiment/ExperimentBlocBuilder";
import { ExperimentBloc } from "./experiment/ExperimentBloc";

import UploadingResultsScreen from "./network/screens/UploadingResults";
import FinishedExperimentScreen from "./finished_experiment_screen";

import ServerDriver from "./network/server_driver";
import { PracticeMathBloc } from "./math/PracticeMathBloc";
import MathBlocBuilder from "./math/MathBlocBuilder";

interface AppConfig {
    initialAppState?: AppState;
    initialPracticeLetterState?: ExperimentState;
    initialPracticeMathState?: ExperimentState;
    subjectId?: string;
    onExperimentFinished?: Function;
}

function App(props: AppConfig) {
    console.debug(`subjectId=${props.subjectId}`);

    const serverDriver = new ServerDriver();
    const timestamp = new Date();

    const appBloc = new AppBloc(
        props.initialAppState ? props.initialAppState : new PracticeMathState(),
        packageInfo.version,
        props.subjectId ? props.subjectId : "missing-subject-id",
        timestamp,
        serverDriver,
        props.onExperimentFinished ? props.onExperimentFinished : () => {}
    );

    const practiceLetterBloc = new PracticeLetterBloc(
        appBloc,
        props.initialPracticeLetterState
    );

    const practiceMathBloc = new PracticeMathBloc(
        appBloc,
        props.initialPracticeMathState
    );

    const experimentBloc = new ExperimentBloc(appBloc);

    return (
        <div className={"App"}>
            <BlocBuilder
                bloc={appBloc}
                builder={(state: AppState) => {
                    console.debug(
                        "App Bloc Builder got new state: " +
                            AppStateType[state.stateType]
                    );

                    switch (state.stateType) {
                        case AppStateType.PRACTICE_LETTERS:
                            return (
                                <LetterBlocBuilder bloc={practiceLetterBloc} />
                            );

                        case AppStateType.PRACTICE_MATH:
                            return <MathBlocBuilder bloc={practiceMathBloc} />;

                        case AppStateType.PRACTICE_BOTH:
                            experimentBloc.reset(
                                true,
                                (state as PracticeBothState).maxReadingTime
                            );
                            return (
                                <ExperimentBlocBuilder bloc={experimentBloc} />
                            );

                        case AppStateType.RUNNING_EXPERIMENT:
                            experimentBloc.reset(
                                false,
                                (state as RunningExperimentState).maxReadingTime
                            );
                            return (
                                <ExperimentBlocBuilder bloc={experimentBloc} />
                            );

                        case AppStateType.UPLOADING_EXPERIMENT:
                            return <UploadingResultsScreen />;

                        case AppStateType.FINISHED_EXPERIMENT:
                            return <FinishedExperimentScreen />;

                        default:
                            return (
                                <div className="App">
                                    <header className="App-header">
                                        <p>
                                            TODO: Implement App State{" "}
                                            {AppStateType[state.stateType]}
                                        </p>
                                    </header>
                                </div>
                            );
                    }
                }}
            />
        </div>
    );
}

export default App;

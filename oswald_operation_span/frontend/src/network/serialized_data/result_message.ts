import { LetterResult } from "../../results/LetterResult";
import MathResult from "../../results/MathResult";
import { deserializeLetterResult, SerializedLetterResult, serializeLetterResult } from "./letter_message";
import { deserializeMathResult, SerializedMathMessage, serializeMathResult } from "./math_message";

export interface SerializedResultMessage {
    subject_id: string;
    experiment_version: string;
    timestamp: string;
    letter_result: SerializedLetterResult;
    math_result: SerializedMathMessage;
}

export interface ResultMessage {
    subject_id: string;
    experiment_version: string;
    timestamp: Date;
    letter_result: LetterResult;
    math_result: MathResult;
}

export function serializeResultMessage(subjectId: string, experimentVersion: string, timestamp: Date, letterResult: LetterResult, mathResult: MathResult): SerializedResultMessage {
    return {
        subject_id: subjectId,
        experiment_version: experimentVersion,
        timestamp: timestamp.toISOString(),
        letter_result: serializeLetterResult(letterResult),
        math_result: serializeMathResult(mathResult),
    };
}

export function deserializeResultMessage(result: SerializedResultMessage): ResultMessage {
    return {
        subject_id: result.subject_id,
        experiment_version: result.experiment_version,
        timestamp: new Date(result.timestamp),
        letter_result: deserializeLetterResult(result.letter_result),
        math_result: deserializeMathResult(result.math_result),
    };
}
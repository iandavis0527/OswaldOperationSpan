import MathResult from "../../results/MathResult";

export interface SerializedMathMessage {
    problems: Array<String>;
    responses: Array<boolean>;
    expected_responses: Array<boolean>;
    reading_times: Array<number>;
    average_rt_millis: number;
    number_correct: number;
}

export function serializeMathResult(result: MathResult): SerializedMathMessage {
    return {
        problems: result.problems,
        responses: result.responses,
        expected_responses: result.expectedResponses,
        reading_times: result.readingTimes,
        average_rt_millis: result.averageRTMillis,
        number_correct: result.numberCorrect,
    };
}

export function deserializeMathResult(result: SerializedMathMessage): MathResult {
    const mathResult = new MathResult();
    mathResult.problems = result.problems;
    mathResult.responses = result.responses;
    mathResult.expectedResponses = result.expected_responses;
    mathResult.readingTimes = result.reading_times;
    mathResult.averageRTMillis = result.average_rt_millis;
    mathResult.numberCorrect = result.number_correct;
    return mathResult;
}

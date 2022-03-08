import { std } from 'mathjs';

export default class MathResult {
    public problems: Array<String> = [];
    public prompts: Array<number> = [];
    public responses: Array<boolean> = [];
    public expectedResponses: Array<boolean> = [];
    public readingTimes: Array<number> = [];
    public averageRTMillis: number = 0;
    public numberCorrect: number = 0;

    addInput(problem: string, prompt: number, expectedAnswer: boolean, answer: boolean, readingTime: number) {
        this.problems.push(problem);
        this.prompts.push(prompt);
        this.responses.push(answer);
        this.expectedResponses.push(expectedAnswer);
        this.readingTimes.push(readingTime);

        if (expectedAnswer == answer) {
            this.numberCorrect++;
        }
    }

    meanReadTime(): number {
        let sum = 0;

        for (let i = 0; i < this.readingTimes.length; i++) {
            let readingTime = this.readingTimes[i];
            sum += readingTime;
        }

        return sum / this.readingTimes.length;
    }

    maxReadingTime(): number { 
        return this.meanReadTime() + (2.5 * std(this.readingTimes));
    }

    percentCorrect(): number {
        return (this.numberCorrect / this.problems.length) * 100;
    }
}
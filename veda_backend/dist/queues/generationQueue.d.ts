import { Queue } from 'bullmq';
export interface GenerationJobData {
    assignmentId: string;
    subject: string;
    grade: string;
    numberOfQuestions: number;
    totalMarks: number;
    questionTypes: string[];
    instructions: string;
}
export declare function getGenerationQueue(): Queue;
export declare function enqueueGenerationJob(data: GenerationJobData): Promise<string>;
//# sourceMappingURL=generationQueue.d.ts.map
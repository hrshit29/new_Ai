import { z } from 'zod';
import { QuestionType } from '../models/Assignment';
declare const QuestionPaperSchema: z.ZodObject<{
    timeAllowed: z.ZodNumber;
    maxMarks: z.ZodNumber;
    generalInstructions: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        sectionType: z.ZodString;
        instruction: z.ZodString;
        marksPerQuestion: z.ZodNumber;
        questions: z.ZodArray<z.ZodObject<{
            number: z.ZodNumber;
            text: z.ZodString;
            difficulty: z.ZodEnum<["Easy", "Moderate", "Challenging"]>;
            marks: z.ZodNumber;
            options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            answer: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
    }, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
    }[];
}, {
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
    }[];
}>;
export type GeneratedPaper = z.infer<typeof QuestionPaperSchema>;
export declare function generateQuestionPaper(data: {
    subject: string;
    grade: string;
    numberOfQuestions: number;
    totalMarks: number;
    questionTypes: QuestionType[];
    instructions: string;
}): Promise<GeneratedPaper>;
export {};
//# sourceMappingURL=aiService.d.ts.map
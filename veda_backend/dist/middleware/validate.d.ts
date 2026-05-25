import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
export declare function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare const createAssignmentSchema: z.ZodObject<{
    title: z.ZodString;
    subject: z.ZodString;
    grade: z.ZodString;
    dueDate: z.ZodEffects<z.ZodString, string, string>;
    questionTypes: z.ZodArray<z.ZodEnum<["mcq", "short_answer", "long_answer", "true_false"]>, "many">;
    numberOfQuestions: z.ZodNumber;
    totalMarks: z.ZodNumber;
    instructions: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    subject: string;
    grade: string;
    dueDate: string;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
}, {
    title: string;
    subject: string;
    grade: string;
    dueDate: string;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions?: string | undefined;
}>;
//# sourceMappingURL=validate.d.ts.map
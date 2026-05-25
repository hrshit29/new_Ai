import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  dueDate: z.string().refine((d) => new Date(d) > new Date(), {
    message: 'Due date must be in the future',
  }),
  questionTypes: z
    .array(z.enum(['mcq', 'short_answer', 'long_answer', 'true_false']))
    .min(1, 'At least one question type required'),
  numberOfQuestions: z.number().int().positive('Number of questions must be positive'),
  totalMarks: z.number().int().positive('Total marks must be positive'),
  instructions: z.string().default(''),
});
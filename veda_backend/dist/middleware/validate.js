"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssignmentSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
function validate(schema) {
    return (req, res, next) => {
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
exports.createAssignmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    grade: zod_1.z.string().min(1, 'Grade is required'),
    dueDate: zod_1.z.string().refine((d) => new Date(d) > new Date(), {
        message: 'Due date must be in the future',
    }),
    questionTypes: zod_1.z
        .array(zod_1.z.enum(['mcq', 'short_answer', 'long_answer', 'true_false']))
        .min(1, 'At least one question type required'),
    numberOfQuestions: zod_1.z.number().int().positive('Number of questions must be positive'),
    totalMarks: zod_1.z.number().int().positive('Total marks must be positive'),
    instructions: zod_1.z.string().default(''),
});
//# sourceMappingURL=validate.js.map
import mongoose, { Document } from 'mongoose';
export type AssignmentStatus = 'draft' | 'generating' | 'completed' | 'failed';
export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'true_false';
export interface IAssignment extends Document {
    title: string;
    subject: string;
    grade: string;
    dueDate: Date;
    questionTypes: QuestionType[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    fileUrl?: string;
    status: AssignmentStatus;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Assignment: mongoose.Model<{
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}> & {
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}>> & mongoose.FlatRecord<{
    title: string;
    subject: string;
    grade: string;
    dueDate: NativeDate;
    questionTypes: ("mcq" | "short_answer" | "long_answer" | "true_false")[];
    numberOfQuestions: number;
    totalMarks: number;
    instructions: string;
    status: "draft" | "generating" | "completed" | "failed";
    fileUrl?: string | null | undefined;
    errorMessage?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Assignment.d.ts.map
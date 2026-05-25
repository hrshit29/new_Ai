import mongoose, { Document, Schema } from 'mongoose';

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

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: {
      type: [String],
      enum: ['mcq', 'short_answer', 'long_answer', 'true_false'],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one question type required',
      },
    },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    instructions: { type: String, default: '' },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['draft', 'generating', 'completed', 'failed'],
      default: 'draft',
    },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AssignmentSchema.index({ createdAt: -1 });
AssignmentSchema.index({ status: 1 });

export const Assignment = mongoose.model('Assignment', AssignmentSchema);
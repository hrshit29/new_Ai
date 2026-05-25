import mongoose, { Document, Schema } from 'mongoose';

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface IQuestion {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[];    // For MCQ
  answer?: string;
}

export interface ISection {
  title: string;         // "Section A"
  sectionType: string;   // "Short Answer Questions"
  instruction: string;
  marksPerQuestion: number;
  questions: IQuestion[];
}

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: number;
  maxMarks: number;
  generalInstructions: string;
  sections: ISection[];
  generatedAt: Date;
}

const QuestionSchema = new Schema({
  number: { type: Number, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  marks: { type: Number, required: true },
  options: [{ type: String }],
  answer: { type: String },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  sectionType: { type: String, required: true },
  instruction: { type: String, required: true },
  marksPerQuestion: { type: Number, required: true },
  questions: [QuestionSchema],
});

const QuestionPaperSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    schoolName: { type: String, default: 'Delhi Public School, Bokaro Steel City' },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    timeAllowed: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    generalInstructions: { type: String, required: true },
    sections: [SectionSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const QuestionPaper = mongoose.model(
  'QuestionPaper',
  QuestionPaperSchema
);
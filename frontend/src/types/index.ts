export type Difficulty = "Easy" | "Moderate" | "Challenging";
export type QuestionType = "short_answer" | "mcq" | "long_answer" | "true_false";
export type GenerationStatus = "draft" | "generating" | "completed" | "failed";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  instructions: string;
  fileUrl?: string;
  status: GenerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentDTO {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  instructions: string;
}

export interface Question {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
  answer?: string;
}

export interface Section {
  title: string;
  sectionType: string;
  instruction: string;
  marksPerQuestion: number;
  questions: Question[];
}

export interface QuestionPaper {
  assignmentId: string;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: number;
  maxMarks: number;
  generalInstructions: string;
  sections: Section[];
  generatedAt: string;
}
import { CreateAssignmentDTO, QuestionType } from '@/types';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateCreateAssignment(
  data: Partial
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.subject?.trim()) errors.subject = 'Subject is required';
  if (!data.grade?.trim()) errors.grade = 'Grade is required';

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required';
  } else if (new Date(data.dueDate) <= new Date()) {
    errors.dueDate = 'Due date must be in the future';
  }

  if (!data.questionTypes?.length) {
    errors.questionTypes = 'At least one question type is required';
  }

  if (!data.numberOfQuestions || data.numberOfQuestions < 1) {
    errors.numberOfQuestions = 'Number of questions must be at least 1';
  }

  if (!data.totalMarks || data.totalMarks < 1) {
    errors.totalMarks = 'Total marks must be at least 1';
  }

  return errors;
}

export const QUESTION_TYPE_LABELS: Record = {
  mcq: 'Multiple Choice (MCQ)',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
  true_false: 'True / False',
};

export const GRADE_OPTIONS = [
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade',
];

export const SUBJECT_OPTIONS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'History', 'Geography', 'Social Studies',
  'Computer Science', 'Economics', 'Political Science',
];
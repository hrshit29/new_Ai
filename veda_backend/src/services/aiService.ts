import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { env } from '../config/env';
import { QuestionType } from '../models/Assignment';

const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Zod schemas for validation
const QuestionSchema = z.object({
  number: z.number(),
  text: z.string().min(1),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  marks: z.number().positive(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const SectionSchema = z.object({
  title: z.string(),
  sectionType: z.string(),
  instruction: z.string(),
  marksPerQuestion: z.number().positive(),
  questions: z.array(QuestionSchema).min(1),
});

const QuestionPaperSchema = z.object({
  timeAllowed: z.number().positive(),
  maxMarks: z.number().positive(),
  generalInstructions: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export type GeneratedPaper = z.infer<typeof QuestionPaperSchema>;

function buildPrompt(data: {
  subject: string;
  grade: string;
  numberOfQuestions: number;
  totalMarks: number;
  questionTypes: QuestionType[];
  instructions: string;
}): string {
  const typeMap: Record<string, string> = {
    mcq: 'Multiple Choice Questions (MCQ) with 4 options each',
    short_answer: 'Short Answer Questions (2-3 sentences each)',
    long_answer: 'Long Answer / Essay Questions',
    true_false: 'True/False Questions',
  };

  const typesDesc = data.questionTypes.map((t) => typeMap[t]).join(', ');

  return `You are an expert teacher creating a professional exam question paper.

ASSIGNMENT DETAILS:
- Subject: ${data.subject}
- Grade/Class: ${data.grade}
- Total Questions: ${data.numberOfQuestions}
- Total Marks: ${data.totalMarks}
- Question Types Required: ${typesDesc}
- Additional Instructions: ${data.instructions || 'None'}

REQUIREMENTS:
1. Distribute questions evenly across the requested question types
2. Group same question types into sections (Section A, Section B, etc.)
3. Assign difficulty levels: roughly 40% Easy, 40% Moderate, 20% Challenging
4. Calculate marks per section appropriately to sum to ${data.totalMarks}
5. For MCQ questions, provide exactly 4 options labeled (a), (b), (c), (d)
6. Provide an answer for EVERY question
7. Set timeAllowed in minutes (typically 1-1.5 min per mark)

RESPOND ONLY WITH VALID JSON — no markdown, no explanation, no code blocks.

{
  "timeAllowed": ,
  "maxMarks": ${data.totalMarks},
  "generalInstructions": "<3-5 general exam instructions as a single string>",
  "sections": [
    {
      "title": "Section A",
      "sectionType": "",
      "instruction": "",
      "marksPerQuestion": ,
      "questions": [
        {
          "number": 1,
          "text": "",
          "difficulty": "",
          "marks": ,
          "options": ["(a) ...", "(b) ...", "(c) ...", "(d) ..."],
          "answer": ""
        }
      ]
    }
  ]
}`;
}

function extractJSON(text: string): string {
  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  throw new Error('No JSON found in AI response');
}

export async function generateQuestionPaper(data: {
  subject: string;
  grade: string;
  numberOfQuestions: number;
  totalMarks: number;
  questionTypes: QuestionType[];
  instructions: string;
}): Promise<GeneratedPaper> {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = buildPrompt(data);

  let response;
  try {
    response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
  } catch (error: any) {
    let cleanMessage = error.message || 'Unknown API Error';
    try {
      // The SDK often throws stringified JSON. Let's try to parse out the real message.
      const jsonMatch = cleanMessage.match(/\{.*\}/);
      if (jsonMatch) {
        const parsedError = JSON.parse(jsonMatch[0]);
        if (parsedError?.error?.message) {
          cleanMessage = parsedError.error.message;
        }
      }
    } catch (e) {
      // Ignore parse errors and fallback to original message
    }
    throw new Error(`AI Error: ${cleanMessage}`);
  }

  const rawText = response.text ?? '';

  if (!rawText) {
    throw new Error('Empty response from Gemini API');
  }

  let parsed: unknown;
  try {
    const jsonStr = extractJSON(rawText);
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse AI response:', rawText.substring(0, 500));
    throw new Error(`Failed to parse AI response as JSON: ${e}`);
  }

  // Validate with Zod
  const result = QuestionPaperSchema.safeParse(parsed);
  if (!result.success) {
    console.error('Zod validation failed:', result.error.format());
    // Attempt to salvage the data by cleaning it up
    throw new Error(`AI response validation failed: ${result.error.message}`);
  }

  return result.data;
}
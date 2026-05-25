"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestionPaper = generateQuestionPaper;
const genai_1 = require("@google/genai");
const zod_1 = require("zod");
const env_1 = require("../config/env");
const genAI = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
// Zod schemas for validation
const QuestionSchema = zod_1.z.object({
    number: zod_1.z.number(),
    text: zod_1.z.string().min(1),
    difficulty: zod_1.z.enum(['Easy', 'Moderate', 'Challenging']),
    marks: zod_1.z.number().positive(),
    options: zod_1.z.array(zod_1.z.string()).optional(),
    answer: zod_1.z.string().optional(),
});
const SectionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    sectionType: zod_1.z.string(),
    instruction: zod_1.z.string(),
    marksPerQuestion: zod_1.z.number().positive(),
    questions: zod_1.z.array(QuestionSchema).min(1),
});
const QuestionPaperSchema = zod_1.z.object({
    timeAllowed: zod_1.z.number().positive(),
    maxMarks: zod_1.z.number().positive(),
    generalInstructions: zod_1.z.string(),
    sections: zod_1.z.array(SectionSchema).min(1),
});
function buildPrompt(data) {
    const typeMap = {
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
function extractJSON(text) {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch)
        return jsonMatch[0];
    throw new Error('No JSON found in AI response');
}
async function generateQuestionPaper(data) {
    if (!env_1.env.GEMINI_API_KEY) {
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
    }
    catch (error) {
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
        }
        catch (e) {
            // Ignore parse errors and fallback to original message
        }
        throw new Error(`AI Error: ${cleanMessage}`);
    }
    const rawText = response.text ?? '';
    if (!rawText) {
        throw new Error('Empty response from Gemini API');
    }
    let parsed;
    try {
        const jsonStr = extractJSON(rawText);
        parsed = JSON.parse(jsonStr);
    }
    catch (e) {
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
//# sourceMappingURL=aiService.js.map
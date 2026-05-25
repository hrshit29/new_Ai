import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Increase max duration for Vercel/serverless if needed

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, grade, numberOfQuestions, totalMarks, questionTypes, instructions } = body;

    // Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert teacher and curriculum designer creating a question paper.

Subject: ${subject}
Grade/Class: ${grade}
Topic/Title: ${title}
Total Questions: ${numberOfQuestions}
Total Marks: ${totalMarks}
Question Types to include: ${questionTypes.join(", ")}
Additional Instructions: ${instructions || "None"}

Generate a structured question paper. 
Divide the paper into appropriate Sections based on the question types (e.g. Section A: Multiple Choice, Section B: Short Answer).
Distribute the ${totalMarks} marks logically among the ${numberOfQuestions} questions.
Assign a difficulty (Easy, Moderate, Challenging) to each question.

You must respond ONLY with a valid JSON object matching this exact TypeScript interface:
{
  "schoolName": "VedaAI Public School",
  "subject": string,
  "grade": string,
  "timeAllowed": number, // in minutes, estimate based on questions (e.g. 45, 60, 90)
  "maxMarks": number, // must equal ${totalMarks}
  "generalInstructions": string,
  "sections": [
    {
      "title": string, // e.g. "Section A"
      "sectionType": string, // e.g. "Multiple Choice Questions"
      "instruction": string, // e.g. "Attempt all questions. Each carries 1 mark."
      "marksPerQuestion": number,
      "questions": [
        {
          "number": number, // continuous numbering (1, 2, 3...)
          "text": string, // the actual question text
          "difficulty": "Easy" | "Moderate" | "Challenging",
          "marks": number,
          "answer": string // the correct answer or detailed points for the answer key
        }
      ]
    }
  ]
}

DO NOT wrap the response in markdown code blocks like \`\`\`json. Just output the raw JSON string.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    
    // Attempt to parse the JSON
    let parsedPaper;
    try {
      parsedPaper = JSON.parse(resultText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", resultText);
      return NextResponse.json(
        { error: 'AI returned malformed JSON.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paper: parsedPaper
    });

  } catch (error: any) {
    console.error("Error generating question paper:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate question paper.' },
      { status: 500 }
    );
  }
}

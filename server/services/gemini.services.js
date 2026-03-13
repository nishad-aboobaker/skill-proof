import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAssessmentQuestion(job) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const prompt = `
    You are a LeetCode problem setter. Generate exactly ONE coding problem for a ${job.title} candidate.
    Required Skills: ${job.skills?.join(', ') || 'JavaScript, TypeScript'}

    Return ONLY a valid JSON object in this exact format, no markdown, no extra text:
    {
        "title": "Problem title here",
        "difficulty": "Easy" or "Medium",
        "description": "Clear problem description here",
        "examples": [
            {
                "input": "example input here",
                "output": "expected output here",
                "explanation": "brief explanation"
            },
            {
                "input": "another input",
                "output": "expected output",
                "explanation": "brief explanation"
            }
        ],
        "constraints": [
            "constraint 1",
            "constraint 2",
            "constraint 3"
        ],
        "functionSignature": "function solve(input) { // your code here }"
    }

    Rules:
    - Must be JavaScript/TypeScript based
    - LeetCode easy/medium difficulty
    - Focus on arrays, strings, objects, or algorithms
    - functionSignature must be a valid JS function starter
    - Return ONLY the JSON, absolutely nothing else
`;

  const result = await model.generateContent(prompt);
  const question = result.response.text().trim();
  return question;
}

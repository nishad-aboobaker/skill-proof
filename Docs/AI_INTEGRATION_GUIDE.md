# Node.js AI Integration Guide
## Developer Job Portal - AI Service Setup

**Focus:** Cost-effective AI solutions using Node.js SDKs (No Python)

---

## 🎯 Recommended Node.js AI Stack

| Task | Node.js SDK / Service | Setup |
|------|----------------------|-------|
| Challenge Generation | `@google/generative-ai` (Gemini) | `npm install @google/generative-ai` |
| Code Analysis | `@huggingface/inference` (CodeBERT) | `npm install @huggingface/inference` |
| Plagiarism Check | `@octokit/rest` (GitHub API) | `npm install @octokit/rest` |

---

## 1. Google Gemini Integration (Node.js)

### Setup
1. Get API Key: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Install: `npm install @google/generative-ai`

### Implementation
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateChallenge = async (jobTitle) => {
  const prompt = `Generate a coding challenge for ${jobTitle} in JSON format.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

---

## 2. HuggingFace Integration (Node.js)

### Setup
1. Get Token: [HuggingFace Settings](https://huggingface.co/settings/tokens)
2. Install: `npm install @huggingface/inference`

### Implementation
```javascript
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_API_KEY);

export const analyzeCodeQuality = async (code) => {
  const response = await hf.textGeneration({
    model: 'microsoft/codebert-base',
    inputs: code
  });
  return response;
};
```

---

## 3. GitHub API (Plagiarism Detection)

### Setup
1. Create Personal Access Token in GitHub Settings.
2. Install: `npm install @octokit/rest`

### Implementation
```javascript
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const searchGitHubCode = async (snippet, language) => {
  const { data } = await octokit.search.code({
    q: `${snippet.substring(0, 100)} language:${language}`
  });
  return data.items;
};
```

---

## 4. Best Practices for JS AI
- **Caching**: Use Redis to store AI responses for identical code/prompts.
- **Rate Limiting**: Use `express-rate-limit` to prevent abuse.
- **Error Handling**: Always wrap AI calls in `try/catch` as external APIs can fail.

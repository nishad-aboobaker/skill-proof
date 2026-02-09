# Technical Documentation (JavaScript Only)
## AI-Powered Developer Job Portal

**Project Code:** e21d1212  
**Stack:** MEAN (MongoDB, Express.js, Angular, Node.js)  
**Backend:** Pure JavaScript (No TypeScript)
**AI Service:** JavaScript/Node.js (No Python)

---

## Quick Start Guide

### Backend Setup (JavaScript Only)

```bash
# Create and setup project
mkdir dev-job-portal && cd dev-job-portal
mkdir backend && cd backend
npm init -y

# Install ALL dependencies
npm install express mongoose dotenv cors helmet bcryptjs jsonwebtoken
npm install express-validator express-rate-limit compression morgan
npm install redis ioredis bull socket.io multer
npm install @google/generative-ai @huggingface/inference @octokit/rest
npm install axios cheerio node-cron

# Dev dependencies
npm install --save-dev nodemon eslint prettier

# Create structure
mkdir -p src/{config,models,controllers,services/ai,middlewares,routes,utils}
mkdir uploads

# Copy environment file
cp .env.example .env
```

### Environment Variables (.env)

```env
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/dev_job_portal

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Free AI APIs (Get these for FREE)
GOOGLE_API_KEY=your_gemini_key          # https://makersuite.google.com/app/apikey
HUGGINGFACE_API_KEY=hf_your_key         # https://huggingface.co/settings/tokens
GITHUB_TOKEN=ghp_your_token             # https://github.com/settings/tokens

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:4200
```

---

## Complete File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── redis.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Submission.js
│   ├── services/
│   │   ├── auth.service.js
│   │   └── ai/
│   │       ├── index.js              # AI Manager
│   │       ├── codeAnalyzer.js
│   │       ├── aiDetector.js
│   │       ├── plagiarismDetector.js
│   │       ├── challengeGenerator.js
│   │       └── scoringEngine.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── job.controller.js
│   │   └── submission.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── errors.js
│   │   └── logger.js
│   └── app.js
├── server.js
├── package.json
└── .env
```

---

## Core Files (Copy-Paste Ready)

### 1. server.js

```javascript
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
```

### 2. src/app.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(compression());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api', routes);
app.use(errorMiddleware);

module.exports = app;
```

### 3. src/config/database.js

```javascript
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. src/config/redis.js

```javascript
const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

module.exports = redis;
```

### 5. src/utils/logger.js

```javascript
const logger = {
  info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
  error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args)
};

module.exports = logger;
```

### 6. src/utils/errors.js

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
```

### 7. src/middlewares/error.middleware.js

```javascript
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  logger.error(err.message, err);

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 8. src/models/User.js

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['developer', 'employer', 'admin'],
    default: 'developer'
  },
  profile: {
    name: { type: String, required: true },
    phone: String,
    skills: [String],
    experience: Number,
    github: String,
    resume: String
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### 9. src/models/Job.js

```javascript
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: {
    skills: { type: [String], required: true },
    experience: { type: String, required: true },
    techStack: [String]
  },
  challenge: {
    problemStatement: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    timeLimit: { type: Number, default: 60 },
    testCases: [{
      input: String,
      expectedOutput: String,
      isHidden: { type: Boolean, default: false }
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
```

### 10. src/models/Submission.js

```javascript
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: { type: String, required: true },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp']
  },
  timeTaken: { type: Number, required: true },
  analysis: {
    plagiarismScore: { type: Number, default: 0 },
    aiDetectionScore: { type: Number, default: 0 },
    codeQualityScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    rank: {
      type: String,
      enum: ['excellent', 'good', 'average', 'below-average', 'failed'],
      default: 'average'
    },
    flags: [String],
    detailedReport: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'analyzed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
```

---

## AI Services (JavaScript - No Python!)

### 11. src/services/ai/index.js (AI Manager)

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HfInference } = require('@huggingface/inference');
const { Octokit } = require('@octokit/rest');
const redis = require('../../config/redis');
const crypto = require('crypto');
const logger = require('../../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

class AIManager {
  constructor() {
    this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.usageCounters = { gemini: 0, huggingface: 0, github: 0 };
  }

  generateCacheKey(data, prefix = 'ai') {
    const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    return `${prefix}:${hash}`;
  }

  async cacheOrExecute(key, fn, ttl = 3600) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        logger.info(`Cache hit: ${key}`);
        return JSON.parse(cached);
      }

      const result = await fn();
      await redis.setex(key, ttl, JSON.stringify(result));
      return result;
    } catch (error) {
      return await fn();
    }
  }

  trackUsage(api) {
    this.usageCounters[api]++;
  }

  getGemini() {
    this.trackUsage('gemini');
    return this.geminiModel;
  }

  getGitHub() {
    this.trackUsage('github');
    return octokit;
  }
}

module.exports = new AIManager();
```

### 12. src/services/ai/codeAnalyzer.js

```javascript
const aiManager = require('./index');
const logger = require('../../utils/logger');

class CodeAnalyzer {
  async analyzeQuality(code, language) {
    const cacheKey = aiManager.generateCacheKey({ code, language, type: 'quality' });
    
    return await aiManager.cacheOrExecute(cacheKey, async () => {
      const prompt = `Analyze this ${language} code. Return JSON with: score (0-100), complexity {time, space}, issues[], strengths[].\n\n${code}`;

      try {
        const model = aiManager.getGemini();
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
      } catch (error) {
        logger.error('Code analysis error:', error);
        return {
          score: 50,
          complexity: { time: 'Unknown', space: 'Unknown' },
          issues: [],
          strengths: []
        };
      }
    });
  }

  async analyzeProblemSolving(code, problemStatement, language) {
    const prompt = `Problem: ${problemStatement}\nCode: ${code}\n\nAnalyze solution. Return JSON with: score, correctness, efficiency, feedback.`;

    try {
      const model = aiManager.getGemini();
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch (error) {
      return { score: 50, correctness: 50, efficiency: 50, feedback: 'Analysis failed' };
    }
  }
}

module.exports = new CodeAnalyzer();
```

### 13. src/services/ai/aiDetector.js

```javascript
const aiManager = require('./index');
const logger = require('../../utils/logger');

class AIDetector {
  async detect(code, language, timeTaken) {
    const patternScore = this.patternDetection(code);
    const timeScore = this.timeAnalysis(code, timeTaken);
    const aiScore = await this.geminiDetection(code, language);

    const combined = patternScore * 0.3 + timeScore * 0.2 + aiScore * 0.5;
    const confidence = this.calculateConfidence([patternScore, timeScore, aiScore]);

    return {
      score: Math.round(combined),
      confidence: Math.round(confidence),
      indicators: this.getIndicators(code)
    };
  }

  patternDetection(code) {
    let score = 0;
    
    // Check generic variables
    const generic = ['result', 'temp', 'data', 'value'];
    const count = generic.reduce((sum, v) => sum + (code.match(new RegExp(v, 'g')) || []).length, 0);
    if (count > 5) score += 30;

    // Check AI patterns
    if (/Here is|This code|Step \d+:/i.test(code)) score += 40;
    
    // Check excessive comments
    const commentRatio = (code.match(/\/\/|#/g) || []).length / code.split('\n').length;
    if (commentRatio > 0.3) score += 30;

    return Math.min(100, score);
  }

  timeAnalysis(code, timeTaken) {
    const lines = code.split('\n').length;
    const expected = lines * 10;
    return timeTaken < expected * 0.3 ? 80 : timeTaken < expected * 0.5 ? 50 : 20;
  }

  async geminiDetection(code, language) {
    try {
      const model = aiManager.getGemini();
      const prompt = `Is this ${language} code AI-generated? Return JSON with score (0-100).\n\n${code.substring(0, 500)}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      const data = JSON.parse(text);
      return data.score || 50;
    } catch (error) {
      return 50;
    }
  }

  calculateConfidence(scores) {
    const avg = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    return variance < 100 ? 90 : variance < 300 ? 70 : 50;
  }

  getIndicators(code) {
    const indicators = [];
    if (/Here is|This code/i.test(code)) indicators.push('AI boilerplate');
    if ((code.match(/\/\/|#/g) || []).length > code.split('\n').length * 0.3) indicators.push('Excessive comments');
    return indicators;
  }
}

module.exports = new AIDetector();
```

### 14. src/services/ai/plagiarismDetector.js

```javascript
const aiManager = require('./index');
const logger = require('../../utils/logger');

class PlagiarismDetector {
  async detect(code, language) {
    try {
      const blocks = this.extractBlocks(code, language);
      const githubResults = await this.checkGitHub(blocks, language);

      const score = githubResults.length > 0 
        ? Math.max(...githubResults.map(r => r.similarity))
        : 0;

      return {
        score: Math.round(score),
        sources: githubResults,
        confidence: score > 60 ? 80 : 50
      };
    } catch (error) {
      logger.error('Plagiarism error:', error);
      return { score: 0, sources: [], confidence: 0 };
    }
  }

  extractBlocks(code, language) {
    const blocks = [];
    
    if (['javascript', 'typescript'].includes(language)) {
      const funcs = code.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
      blocks.push(...funcs);
    } else if (language === 'python') {
      const funcs = code.match(/def\s+\w+\s*\([^)]*\):[^\n]*/g) || [];
      blocks.push(...funcs);
    }

    if (blocks.length === 0) {
      const lines = code.split('\n');
      const chunk = lines.slice(0, 20).join('\n');
      if (chunk.length > 100) blocks.push(chunk);
    }

    return blocks.slice(0, 3);
  }

  async checkGitHub(blocks, language) {
    const results = [];
    const octokit = aiManager.getGitHub();

    for (const block of blocks) {
      try {
        const query = `${block.substring(0, 50)} language:${language}`;
        const response = await octokit.search.code({ q: query, per_page: 2 });

        if (response.data?.items) {
          response.data.items.forEach(item => {
            const similarity = this.calculateSimilarity(block, item.name || '');
            if (similarity > 30) {
              results.push({
                url: item.html_url,
                similarity: Math.round(similarity),
                repository: item.repository?.full_name
              });
            }
          });
        }
      } catch (error) {
        continue;
      }
    }

    return results.slice(0, 5);
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const distance = this.levenshtein(longer, shorter);
    return ((longer.length - distance) / longer.length) * 100;
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1]
          ? matrix[i-1][j-1]
          : Math.min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j]) + 1;
      }
    }

    return matrix[b.length][a.length];
  }
}

module.exports = new PlagiarismDetector();
```

### 15. src/services/ai/challengeGenerator.js

```javascript
const aiManager = require('./index');
const logger = require('../../utils/logger');

class ChallengeGenerator {
  async generate(jobTitle, description, skills, difficulty) {
    const cacheKey = aiManager.generateCacheKey({ jobTitle, skills, difficulty });

    return await aiManager.cacheOrExecute(cacheKey, async () => {
      const prompt = `Generate a ${difficulty} coding challenge for ${jobTitle}. Skills: ${skills.join(', ')}.
Return JSON with: title, problemStatement, difficulty, timeLimit (minutes), testCases[{input, expectedOutput}].`;

      try {
        const model = aiManager.getGemini();
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const challenge = JSON.parse(text);

        return {
          title: challenge.title || `${jobTitle} Challenge`,
          problemStatement: challenge.problemStatement || 'Write a function...',
          difficulty: difficulty,
          timeLimit: challenge.timeLimit || 60,
          testCases: challenge.testCases || []
        };
      } catch (error) {
        logger.error('Challenge generation error:', error);
        return this.getDefaultChallenge(jobTitle, difficulty);
      }
    });
  }

  getDefaultChallenge(jobTitle, difficulty) {
    return {
      title: `${jobTitle} - Coding Challenge`,
      problemStatement: 'Implement a function to solve a common programming problem.',
      difficulty: difficulty,
      timeLimit: 60,
      testCases: []
    };
  }
}

module.exports = new ChallengeGenerator();
```

### 16. src/services/ai/scoringEngine.js

```javascript
class ScoringEngine {
  calculateFinalScore(analysis) {
    const base = (
      analysis.codeQualityScore * 0.25 +
      analysis.problemSolvingScore * 0.25 +
      analysis.originalityScore * 0.20 +
      (100 - analysis.plagiarismScore) * 0.15 +
      (100 - analysis.aiDetectionScore) * 0.15
    );

    const plagiarismPenalty = this.getPlagiarismPenalty(analysis.plagiarismScore);
    const aiPenalty = this.getAIPenalty(analysis.aiDetectionScore);

    const final = Math.max(0, Math.min(100, base - plagiarismPenalty - aiPenalty));
    return Math.round(final);
  }

  getPlagiarismPenalty(score) {
    if (score <= 20) return 0;
    if (score <= 40) return 10;
    if (score <= 60) return 30;
    if (score <= 80) return 60;
    return 100;
  }

  getAIPenalty(score) {
    if (score <= 30) return 0;
    if (score <= 50) return 10;
    if (score <= 70) return 30;
    return 50;
  }

  determineRank(finalScore) {
    if (finalScore >= 90) return 'excellent';
    if (finalScore >= 75) return 'good';
    if (finalScore >= 60) return 'average';
    if (finalScore >= 40) return 'below-average';
    return 'failed';
  }
}

module.exports = new ScoringEngine();
```

---

## Continue in Part 2 for Controllers, Routes, and API endpoints...

See next file for complete implementation!
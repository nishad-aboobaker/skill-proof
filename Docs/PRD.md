# Product Requirements Document (PRD)
## AI-Powered Developer Job Portal

**Version:** 1.0  
**Date:** February 9, 2026  
**Project Code:** e21d1212

---

## Executive Summary

A MEAN Stack-based job portal specifically designed for developer recruitment that leverages AI to evaluate coding submissions, detect plagiarism, identify AI-generated code, and provide intelligent candidate ranking to employers.

---

## 1. Product Overview

### 1.1 Vision
To create a fair, intelligent, and automated recruitment platform that accurately assesses developer capabilities through AI-driven code analysis, eliminating bias and providing actionable insights to employers.

### 1.2 Target Users

**Primary Users:**
- Recruiters and hiring managers seeking qualified developers
- Software developers looking for job opportunities
- Technical hiring teams at startups and enterprises

**User Personas:**

*Persona 1: Tech Recruiter (Sarah)*
- Needs to quickly evaluate 50+ candidates per role
- Limited technical background
- Requires clear ranking and insights
- Values time-saving automation

*Persona 2: Software Developer (Raj)*
- Wants fair evaluation of skills
- Prefers coding challenges over traditional interviews
- Seeks transparent feedback
- Values platforms that showcase real abilities

*Persona 3: Engineering Manager (Mike)*
- Makes final hiring decisions
- Needs detailed technical assessments
- Wants to identify code quality and problem-solving approach
- Values anti-cheating mechanisms

---

## 2. Core Features & Requirements

### 2.1 User Management

**Developer Features:**
- User registration and authentication (JWT-based)
- Profile creation with skills, experience, GitHub integration
- Resume/CV upload (PDF, DOCX)
- Job application tracking dashboard
- Notification system for application status

**Employer Features:**
- Company registration and verification
- Job posting creation and management
- Candidate search and filtering
- Interview scheduling
- Messaging system with candidates

### 2.2 AI-Powered Assessment System

**2.2.1 Challenge Generation**
- AI generates contextual coding challenges based on:
  - Job role requirements
  - Technology stack
  - Experience level (Junior/Mid/Senior)
  - Company-specific needs
- Multiple difficulty levels
- Time-bound assessments (configurable)

**2.2.2 Code Submission Analysis**

The AI Agent evaluates submissions across multiple dimensions:

**A. Plagiarism Detection**
- Compare against public code repositories (GitHub, Stack Overflow)
- Check against previous submissions in the platform
- Similarity scoring algorithm
- Source identification and citation

**B. AI-Generated Code Detection**
- Pattern recognition for AI-generated code signatures
- Analysis of code style consistency
- Comment pattern analysis
- Variable naming convention analysis
- Code complexity vs. time taken correlation
- Detect patterns from ChatGPT, GitHub Copilot, Claude, etc.

**C. Code Quality Assessment**
- Time complexity analysis
- Space complexity analysis
- Code readability and maintainability
- Best practices adherence
- Security vulnerability detection
- Test coverage (if tests provided)

**D. Problem-Solving Approach**
- Solution efficiency
- Edge case handling
- Error handling
- Code organization and structure
- Algorithm selection appropriateness

### 2.3 Ranking System

**Multi-Factor Scoring Algorithm:**

```
Final Score = (
  Code Quality Score × 0.25 +
  Problem Solving Score × 0.25 +
  Originality Score × 0.20 +
  Time Efficiency × 0.15 +
  Best Practices Score × 0.15
) - Plagiarism Penalty - AI Detection Penalty
```

**Penalty System:**
- Plagiarism Detection: -30 to -100 points (based on percentage)
- AI-Generated Code: -20 to -80 points (based on confidence)
- Late Submission: -5 to -20 points (based on delay)

**Ranking Categories:**
- Excellent (90-100): Highly recommended
- Good (75-89): Recommended
- Average (60-74): Consider with caution
- Below Average (40-59): Not recommended
- Failed (<40): Rejected

### 2.4 Dashboard & Reporting

**For Employers:**
- Candidate ranking dashboard
- Detailed assessment reports
- Comparison matrix
- AI confidence scores
- Red flags and warnings
- Code review interface with highlighting
- Historical performance analytics

**For Developers:**
- Performance feedback
- Areas for improvement
- Skill gap analysis
- Progress tracking over multiple applications
- Practice mode for skill improvement

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Frontend:**
- Angular 17+ (latest stable)
- TypeScript
- Angular Material UI / PrimeNG
- RxJS for state management
- Chart.js for analytics visualization

**Backend:**
- Node.js with Express.js
- TypeScript
- REST API architecture
- JWT for authentication
- Redis for caching and session management

**Database:**
- MongoDB (primary database)
- Schema: Users, Jobs, Applications, Submissions, Assessments
- Indexing strategy for performance

**AI/ML Services:**
- Python microservice for AI analysis
- Integration with free AI APIs (detailed in section 4)

### 3.2 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                      │
│  (User Interface, Dashboards, Code Editor Integration)  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│              Express.js API Gateway                      │
│        (Authentication, Rate Limiting, Routing)          │
└───────────┬─────────────────────┬───────────────────────┘
            │                     │
   ┌────────▼─────────┐   ┌──────▼──────────────────────┐
   │   MongoDB        │   │   Python AI Microservice    │
   │   Database       │   │   (Code Analysis Engine)    │
   └──────────────────┘   └─────────────┬───────────────┘
                                        │
                            ┌───────────▼────────────────┐
                            │  Free AI API Integration   │
                            │  (HuggingFace, OpenRouter) │
                            └────────────────────────────┘
```

### 3.3 Database Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (developer/employer),
  profile: {
    name: String,
    phone: String,
    location: String,
    skills: [String],
    experience: Number,
    github: String,
    linkedin: String,
    resume: String (file path)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Jobs Collection:**
```javascript
{
  _id: ObjectId,
  employerId: ObjectId,
  title: String,
  description: String,
  requirements: {
    skills: [String],
    experience: String,
    techStack: [String]
  },
  challenge: {
    generatedBy: String (AI),
    problemStatement: String,
    difficulty: String,
    timeLimit: Number,
    testCases: [Object]
  },
  status: String (active/closed),
  applicants: [ObjectId],
  createdAt: Date,
  expiresAt: Date
}
```

**Submissions Collection:**
```javascript
{
  _id: ObjectId,
  jobId: ObjectId,
  developerId: ObjectId,
  code: String,
  language: String,
  submittedAt: Date,
  timeTaken: Number,
  analysis: {
    plagiarismScore: Number,
    aiDetectionScore: Number,
    codeQualityScore: Number,
    problemSolvingScore: Number,
    originalityScore: Number,
    timeEfficiencyScore: Number,
    bestPracticesScore: Number,
    flags: [String],
    detailedReport: Object
  },
  finalScore: Number,
  rank: String,
  status: String (pending/analyzed/reviewed)
}
```

---

## 4. AI Integration - Free Solutions

### 4.1 Recommended Free AI Services

**Option 1: HuggingFace Inference API (Recommended)**

**Capabilities:**
- Code analysis models
- Text generation for challenge creation
- Free tier: 30,000 API calls/month
- Models to use:
  - `microsoft/codebert-base` - Code understanding
  - `Salesforce/codet5-base` - Code generation detection
  - `google/flan-t5-large` - Challenge generation

**Implementation:**
```javascript
// Example integration
const HuggingFaceAPI = require('@huggingface/inference');

const hf = new HuggingFaceAPI({
  apiKey: process.env.HF_API_KEY // Free tier
});

async function analyzeCode(code) {
  const result = await hf.textGeneration({
    model: 'microsoft/codebert-base',
    inputs: code
  });
  return result;
}
```

**Option 2: OpenRouter (Free Tier)**

**Capabilities:**
- Access to multiple free models
- Llama 3.1 8B (free)
- Mistral 7B (free)
- Good for code analysis and challenge generation

**Free Limits:**
- 200 requests/day for free models
- Rate limit: 20 requests/minute

**Implementation:**
```javascript
const OpenRouter = require('openrouter');

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_KEY
});

async function generateChallenge(jobDescription) {
  const response = await client.chat.completions.create({
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    messages: [{
      role: 'user',
      content: `Generate a coding challenge for: ${jobDescription}`
    }]
  });
  return response.choices[0].message.content;
}
```

**Option 3: Google Gemini Free API**

**Capabilities:**
- Gemini 1.5 Flash (free tier)
- 15 requests per minute
- 1,500 requests per day
- Excellent for code analysis

**Implementation:**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function detectAICode(code) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Analyze this code and determine if it's AI-generated: ${code}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 4.2 Hybrid Approach (Recommended)

Use a combination for cost-effectiveness and reliability:

1. **Challenge Generation:** Google Gemini (15 req/min free)
2. **Code Analysis:** HuggingFace CodeBERT (30k/month free)
3. **AI Detection:** Custom algorithm + OpenRouter Llama (200/day free)
4. **Plagiarism:** Local algorithm + GitHub API

### 4.3 Plagiarism Detection Strategy

**Without expensive APIs:**

1. **Local Code Similarity Algorithm:**
   - Levenshtein distance
   - Token-based comparison
   - AST (Abstract Syntax Tree) comparison

2. **GitHub API Integration (Free):**
   - 60 requests/hour unauthenticated
   - 5,000 requests/hour with token (free)
   - Search code snippets

3. **Code Fingerprinting:**
   - Hash-based duplicate detection
   - Store fingerprints of all submissions
   - Cross-reference with public repositories

**Implementation Example:**
```javascript
const { Octokit } = require('@octokit/rest');
const leven = require('leven');

async function checkGitHubPlagiarism(code) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Extract key functions and search
  const keyFunctions = extractFunctions(code);
  
  for (const func of keyFunctions) {
    const { data } = await octokit.search.code({
      q: func.slice(0, 100) // Search first 100 chars
    });
    
    if (data.total_count > 0) {
      return {
        plagiarized: true,
        sources: data.items.map(i => i.html_url)
      };
    }
  }
  
  return { plagiarized: false };
}
```

---

## 5. Development Phases

### Phase 1: MVP (Weeks 1-4)
- User authentication system
- Basic job posting and application
- Simple code submission interface
- Basic code quality analysis (without AI)
- MongoDB setup and basic APIs

**Deliverables:**
- Working authentication
- Job CRUD operations
- Code submission form
- Basic scoring algorithm

### Phase 2: AI Integration (Weeks 5-8)
- Integrate HuggingFace for code analysis
- Implement Google Gemini for challenge generation
- Build plagiarism detection algorithm
- Create scoring and ranking system
- Dashboard for employers

**Deliverables:**
- AI-powered code analysis
- Challenge generation
- Plagiarism detection
- Ranking dashboard

### Phase 3: Advanced Features (Weeks 9-12)
- AI-generated code detection
- Advanced analytics and reporting
- Notification system
- Email integration
- Search and filter optimization
- Code review interface

**Deliverables:**
- Complete AI detection pipeline
- Email notifications
- Advanced dashboards
- Search functionality

### Phase 4: Polish & Launch (Weeks 13-16)
- Performance optimization
- Security hardening
- UI/UX refinement
- Testing and bug fixes
- Documentation
- Deployment

**Deliverables:**
- Production-ready application
- Documentation
- Deployment scripts
- User guides

---

## 6. Non-Functional Requirements

### 6.1 Performance
- API response time: <500ms for 95% of requests
- Page load time: <2 seconds
- Code analysis time: <30 seconds per submission
- Support 1000+ concurrent users

### 6.2 Security
- HTTPS encryption
- JWT token expiration (15 min access, 7 day refresh)
- Input sanitization and validation
- SQL injection prevention (NoSQL injection)
- XSS protection
- CSRF tokens
- Rate limiting on APIs
- Secure file upload handling

### 6.3 Scalability
- Horizontal scaling capability
- Database indexing strategy
- Caching layer (Redis)
- CDN for static assets
- Queue system for AI analysis (Bull/RabbitMQ)

### 6.4 Reliability
- 99.5% uptime target
- Automated backups (daily)
- Error logging and monitoring
- Graceful error handling

---

## 7. Success Metrics

### 7.1 User Metrics
- User registration rate
- Job posting volume
- Application submission rate
- User retention rate
- Time to hire

### 7.2 Platform Metrics
- AI analysis accuracy
- False positive rate for plagiarism (<5%)
- False positive rate for AI detection (<10%)
- Average time per code analysis
- API success rate (>99%)

### 7.3 Business Metrics
- Monthly active users (MAU)
- Conversion rate (visitor to registered user)
- Employer satisfaction score
- Developer satisfaction score

---

## 8. Risk Assessment

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI API rate limits exceeded | High | Medium | Implement queuing, multiple API fallbacks |
| False plagiarism detection | High | Medium | Multi-layer verification, manual review option |
| Performance degradation | Medium | Medium | Implement caching, optimize queries |
| Security breach | High | Low | Security audits, penetration testing |

### 8.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Marketing strategy, beta testing |
| Competitor entry | Medium | High | Focus on unique AI features |
| Accuracy concerns | High | Medium | Transparent scoring, continuous improvement |

---

## 9. Future Enhancements

### Phase 2 Features (Post-MVP)
- Video interview integration
- Live coding sessions with recording
- Skill-based matchmaking
- Salary insights and benchmarking
- Mobile application (React Native)
- Advanced analytics for employers
- API for third-party integrations
- White-label solution for enterprises

### Advanced AI Features
- Behavioral analysis during coding
- Personalized challenge generation
- Learning path recommendations
- Automated code review suggestions
- Predictive hiring success scores

---

## 10. Compliance & Legal

### 10.1 Data Privacy
- GDPR compliance for EU users
- Data encryption at rest and in transit
- User data deletion capability
- Privacy policy and terms of service
- Cookie consent management

### 10.2 Fair Use
- Transparent scoring algorithms
- Appeal process for candidates
- No discrimination in AI algorithms
- Regular bias audits

---

## Appendix A: API Endpoint Structure

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

Users:
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/:id
DELETE /api/users/:id

Jobs:
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/apply

Submissions:
POST   /api/submissions
GET    /api/submissions/:id
GET    /api/submissions/job/:jobId
PUT    /api/submissions/:id/analyze

AI Analysis:
POST   /api/ai/generate-challenge
POST   /api/ai/analyze-code
POST   /api/ai/detect-plagiarism
POST   /api/ai/detect-ai-code

Analytics:
GET    /api/analytics/employer/:id
GET    /api/analytics/developer/:id
```

---

## Appendix B: Recommended Free Tools & Libraries

**Frontend:**
- Monaco Editor (VS Code editor in browser)
- Chart.js for analytics
- Socket.io for real-time updates

**Backend:**
- bcryptjs for password hashing
- jsonwebtoken for JWT
- express-validator for input validation
- express-rate-limit for API throttling
- helmet for security headers

**AI/ML:**
- @huggingface/inference
- @google/generative-ai
- natural (NLP library)
- compromise (text analysis)

**Code Analysis:**
- esprima (JavaScript parser)
- acorn (JavaScript AST)
- jscpd (copy-paste detector)

**Testing:**
- Jest (unit testing)
- Supertest (API testing)
- Cypress (E2E testing)

---

**Document Version History:**
- v1.0 - February 9, 2026 - Initial PRD creation

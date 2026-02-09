# AI-Powered Developer Job Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-blue.svg)](https://www.mongodb.com/)
[![Angular](https://img.shields.io/badge/Angular-17+-red.svg)](https://angular.io/)

A revolutionary job portal specifically designed for developer recruitment that leverages AI to evaluate coding submissions, detect plagiarism, identify AI-generated code, and provide intelligent candidate ranking to employers.

## 🎯 Vision

To create a fair, intelligent, and automated recruitment platform that accurately assesses developer capabilities through AI-driven code analysis, eliminating bias and providing actionable insights to employers.

## ✨ Key Features

### 🤖 AI-Powered Assessment System

- **Challenge Generation**: AI creates contextual coding challenges based on job requirements
- **Code Quality Analysis**: Evaluates time/space complexity, readability, and best practices
- **Plagiarism Detection**: Compares against public repositories and previous submissions
- **AI Code Detection**: Identifies AI-generated code patterns from ChatGPT, Copilot, etc.
- **Problem-Solving Evaluation**: Assesses solution efficiency and approach

### 📊 Intelligent Ranking System

- Multi-factor scoring algorithm with weighted components
- Penalty system for plagiarism and AI-generated content
- Five-tier ranking: Excellent, Good, Average, Below Average, Failed
- Detailed assessment reports with code highlighting

### 👥 Dual User Experience

- **For Developers**: Fair evaluation, skill gap analysis, progress tracking
- **For Employers**: Candidate ranking dashboard, comparison matrix, AI confidence scores

### 🔒 Security & Compliance

- JWT-based authentication
- GDPR compliance
- Secure file uploads
- Rate limiting and input validation

## 🛠️ Technology Stack

### Frontend

- **Angular 17+** - Modern reactive framework
- **TypeScript** - Type-safe development
- **Angular Material** - UI components
- **RxJS** - Reactive programming
- **Chart.js** - Analytics visualization

### Backend

- **Node.js** with Express.js - RESTful API
- **MongoDB** - NoSQL database
- **Redis** - Caching and session management
- **JWT** - Authentication
- **Socket.io** - Real-time features

### AI Services (100% Free Tiers)

- **Google Gemini 1.5 Flash** - Challenge generation (1,500 req/day)
- **HuggingFace Inference API** - Code analysis (30,000 req/month)
- **GitHub API** - Plagiarism detection (5,000 req/hour)
- **OpenRouter** - Backup AI services (200 req/day)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 7+
- Redis
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-developer-job-portal.git
   cd ai-developer-job-portal
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ng serve
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB
   mongod

   # Start Redis
   redis-server
   ```

### Environment Configuration

Create `.env` file in backend directory:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/dev_job_portal

# AI APIs (All FREE)
GOOGLE_API_KEY=your_gemini_key
HUGGINGFACE_API_KEY=your_hf_key
GITHUB_TOKEN=your_github_token

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📁 Project Structure

```
ai-developer-job-portal/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database & Redis config
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # AI services & business logic
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, error handling
│   │   └── routes/         # API endpoints
│   └── uploads/            # File storage
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
├── docs/                   # Documentation
│   ├── PRD.md             # Product Requirements
│   ├── AI_INTEGRATION_GUIDE.md
│   └── TECHNICAL_DOCUMENTATION.md
└── README.md
```

## 🔧 Development Phases

### Phase 1: MVP (Weeks 1-4)

- ✅ User authentication system
- ✅ Basic job posting and application
- ✅ Simple code submission interface
- ✅ Basic code quality analysis

### Phase 2: AI Integration (Weeks 5-8)

- 🔄 AI-powered code analysis
- 🔄 Plagiarism detection
- 🔄 Challenge generation
- 🔄 Ranking dashboard

### Phase 3: Advanced Features (Weeks 9-12)

- 📋 AI-generated code detection
- 📋 Advanced analytics
- 📋 Notification system
- 📋 Code review interface

### Phase 4: Polish & Launch (Weeks 13-16)

- 🎨 Performance optimization
- 🔒 Security hardening
- 🎯 UI/UX refinement
- 📚 Documentation

## 📡 API Endpoints

### Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Jobs

```http
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/apply
```

### Submissions

```http
POST   /api/submissions
GET    /api/submissions/:id
GET    /api/submissions/job/:jobId
PUT    /api/submissions/:id/analyze
```

### AI Analysis

```http
POST   /api/ai/generate-challenge
POST   /api/ai/analyze-code
POST   /api/ai/detect-plagiarism
POST   /api/ai/detect-ai-code
```

## 🎯 Scoring Algorithm

```
Final Score = (
  Code Quality Score × 0.25 +
  Problem Solving Score × 0.25 +
  Originality Score × 0.20 +
  Time Efficiency × 0.15 +
  Best Practices Score × 0.15
) - Plagiarism Penalty - AI Detection Penalty
```

### Penalty System

- Plagiarism: -30 to -100 points (based on similarity)
- AI-Generated: -20 to -80 points (based on confidence)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commits

## 📊 Performance Metrics

- **API Response Time**: <500ms (95% of requests)
- **Page Load Time**: <2 seconds
- **Code Analysis Time**: <30 seconds per submission
- **Uptime Target**: 99.5%

## 🔐 Security Features

- HTTPS encryption
- JWT token expiration (15min access, 7day refresh)
- Input sanitization and validation
- XSS protection and CSRF tokens
- Secure file upload handling
- Rate limiting on all APIs

## 📈 Success Metrics

### User Metrics

- Monthly Active Users (MAU)
- Job posting volume
- Application submission rate
- User retention rate

### Platform Metrics

- AI analysis accuracy (>95%)
- False positive rate (<5% for plagiarism, <10% for AI detection)
- Average code analysis time (<30s)

## 📚 Documentation

- [Product Requirements Document](./docs/PRD.md)
- [AI Integration Guide](./docs/AI_INTEGRATION_GUIDE.md)
- [Technical Documentation](./docs/TECHNICAL_DOCUMENTATION_JAVASCRIPT.md)
- [API Documentation](./docs/API_REFERENCE.md)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                     │
│  (User Interface, Dashboards, Code Editor Integration)  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│              Express.js API Gateway                     │
│        (Authentication, Rate Limiting, Routing)         │
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google for Gemini API
- HuggingFace for AI models
- GitHub for API access
- OpenRouter for AI service aggregation


---

**Project Code:** e21d1212  
**Version:** 1.0  
**Date:** February 9, 2026

Built with ❤️ for fair and intelligent developer recruitment

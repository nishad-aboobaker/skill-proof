# Technical Documentation (JavaScript MVC)
## AI-Powered Developer Job Portal

**Stack:** Node.js, Express, MongoDB, Angular
**Pattern:** MVC (Model-View-Controller)
**Module System:** ES Modules (`import/export`)

---

## 1. Project Structure (MVC)

The backend is structured to separate concerns using the MVC pattern:

```
server/
├── config/             # Database & Service connections
├── controllers/        # Request handling & Logic
├── models/             # Mongoose Schemas & Data logic
├── routes/             # API Route definitions
├── middlewares/        # Auth & Error middlewares
├── services/           # AI SDKs & Third-party integrations
├── utils/              # Helper functions & Loggers
├── .env                # Environment variables
└── server.js           # Entry point
```

---

## 2. Core Implementation (ES Modules)

### server.js (Entry Point)
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import mainRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', mainRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
```

### Example Model: models/User.js
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['developer', 'employer'], default: 'developer' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### Example Controller: controllers/authController.js
```javascript
import User from '../models/User.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
```

---

## 3. AI Service Integration (Node.js SDKs)

AI features are implemented as services, avoiding Python entirely.

### services/aiService.js
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const hf = new HfInference(process.env.HF_API_KEY);

export const analyzeCode = async (code) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Analyze this code: ${code}`);
    return result.response.text();
};
```

---

## 4. Dependencies
Recommended packages for the MVC stack:
```bash
npm install express mongoose dotenv cors cookie-parser
npm install @google/generative-ai @huggingface/inference @octokit/rest
npm install bcryptjs jsonwebtoken express-validator
```
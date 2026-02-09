# Free AI Integration Guide
## Developer Job Portal - AI Service Setup

**Project:** e21d1212  
**Focus:** Cost-effective AI solutions using free tiers

---

## 🎯 Recommended Free AI Stack

### Primary Recommendation: **Hybrid Approach**

| Task | Free AI Service | Monthly Limit | Best For |
|------|----------------|---------------|----------|
| Challenge Generation | Google Gemini 1.5 Flash | 1,500 requests/day | Natural language generation |
| Code Analysis | HuggingFace CodeBERT | 30,000 calls/month | Code understanding |
| AI Code Detection | Gemini + Pattern Analysis | 1,500 requests/day | Hybrid detection |
| Plagiarism Check | GitHub API + Local Algorithm | 5,000 requests/hour | Source matching |

---

## 1. Google Gemini API (RECOMMENDED for Challenge Generation)

### Why Gemini?
- ✅ Best free tier: 1,500 requests/day
- ✅ 15 RPM (requests per minute)
- ✅ Excellent for code understanding and generation
- ✅ Fast response times
- ✅ Good context window (1M tokens)

### Setup

**Step 1: Get API Key**
```bash
# Visit: https://makersuite.google.com/app/apikey
# Create a new API key (completely free)
```

**Step 2: Install SDK**
```bash
pip install google-generativeai
```

**Step 3: Implementation**

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# Generate challenge
response = model.generate_content(f"""
Generate a coding challenge for a {job_title} position.
Return JSON format with title, problem statement, test cases.
""")

print(response.text)
```

### Rate Limits
- **Free tier:** 1,500 requests/day
- **RPM:** 15 requests/minute
- **Token limit:** 1M input tokens

### Best Practices
```python
import time
from functools import lru_cache

class RateLimiter:
    def __init__(self, max_calls=15, period=60):
        self.max_calls = max_calls
        self.period = period
        self.calls = []
    
    def __call__(self, func):
        def wrapper(*args, **kwargs):
            now = time.time()
            # Remove old calls
            self.calls = [c for c in self.calls if now - c < self.period]
            
            if len(self.calls) >= self.max_calls:
                sleep_time = self.period - (now - self.calls[0])
                time.sleep(sleep_time)
                self.calls = []
            
            self.calls.append(now)
            return func(*args, **kwargs)
        return wrapper

@RateLimiter(max_calls=15, period=60)
def call_gemini_api(prompt):
    # Your Gemini API call here
    pass
```

---

## 2. HuggingFace Inference API (for Code Analysis)

### Why HuggingFace?
- ✅ 30,000 free API calls/month
- ✅ Access to specialized code models
- ✅ No credit card required
- ✅ Open-source models

### Setup

**Step 1: Get Token**
```bash
# Visit: https://huggingface.co/settings/tokens
# Create a new access token (FREE)
```

**Step 2: Install**
```bash
pip install huggingface-hub
```

**Step 3: Implementation**

```python
from huggingface_hub import InferenceClient

client = InferenceClient(token=os.getenv("HF_TOKEN"))

# Code analysis
result = client.text_classification(
    model="microsoft/codebert-base",
    input=code_snippet
)
```

### Recommended Models

**1. microsoft/codebert-base** (Code Understanding)
```python
def analyze_code_quality(code):
    response = client.feature_extraction(
        model="microsoft/codebert-base",
        inputs=code
    )
    # Returns embeddings for similarity comparison
    return response
```

**2. Salesforce/codet5-base** (Code Generation Detection)
```python
def detect_generated_code(code):
    response = client.text_generation(
        model="Salesforce/codet5-base",
        inputs=f"Is this code AI-generated? {code[:500]}"
    )
    return response
```

**3. codeparrot/codeparrot** (Code Analysis)
```python
def analyze_with_codeparrot(code):
    response = client.text_generation(
        model="codeparrot/codeparrot",
        inputs=code
    )
    return response
```

### Rate Limits
- **Free tier:** 30,000 requests/month (≈1,000/day)
- **Good for:** Batch processing, code embeddings

---

## 3. OpenRouter (Multiple Free Models)

### Why OpenRouter?
- ✅ Aggregates multiple free models
- ✅ 200 requests/day for free models
- ✅ Access to Llama, Mistral, etc.
- ✅ Single API for multiple providers

### Setup

**Step 1: Sign Up**
```bash
# Visit: https://openrouter.ai/
# Sign up (free tier available)
```

**Step 2: Install**
```bash
npm install openrouter-sdk
# or
pip install openrouter
```

**Step 3: Implementation**

```javascript
const OpenRouter = require('openrouter-sdk');

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Use free Llama model
const response = await client.chat.completions.create({
  model: 'meta-llama/llama-3.1-8b-instruct:free',
  messages: [{
    role: 'user',
    content: 'Analyze this code for quality...'
  }]
});
```

### Free Models Available

| Model | Use Case | Daily Limit |
|-------|----------|-------------|
| meta-llama/llama-3.1-8b-instruct:free | General code analysis | 200 req/day |
| mistralai/mistral-7b-instruct:free | Code review | 200 req/day |
| google/gemma-7b-it:free | Text analysis | 200 req/day |

---

## 4. GitHub API (for Plagiarism Detection)

### Why GitHub API?
- ✅ 5,000 requests/hour with token (FREE)
- ✅ Access to billions of code examples
- ✅ Perfect for plagiarism checking

### Setup

**Step 1: Create Personal Access Token**
```bash
# Visit: https://github.com/settings/tokens
# Create new token with 'public_repo' scope
```

**Step 2: Implementation**

```python
import aiohttp
import os

class GitHubPlagiarismChecker:
    def __init__(self):
        self.token = os.getenv("GITHUB_TOKEN")
        self.api_url = "https://api.github.com/search/code"
    
    async def search_code(self, code_snippet, language):
        headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        # Prepare search query
        query = f"{code_snippet[:100]} language:{language}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                self.api_url,
                headers=headers,
                params={"q": query, "per_page": 5}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('items', [])
                return []
```

**Step 3: Local Similarity Algorithm**

```python
from difflib import SequenceMatcher

def calculate_similarity(code1, code2):
    """Calculate code similarity percentage"""
    # Normalize code
    norm1 = normalize_code(code1)
    norm2 = normalize_code(code2)
    
    # Calculate similarity
    ratio = SequenceMatcher(None, norm1, norm2).ratio()
    return ratio * 100

def normalize_code(code):
    """Remove comments, whitespace for comparison"""
    import re
    
    # Remove comments
    code = re.sub(r'//.*?$|/\*.*?\*/', '', code, flags=re.M|re.S)
    code = re.sub(r'#.*?$', '', code, flags=re.M)
    
    # Remove extra whitespace
    code = re.sub(r'\s+', ' ', code)
    
    return code.lower().strip()
```

---

## 5. Complete AI Service Architecture

### Recommended Setup

```python
# ai-service/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

class AIConfig:
    # Google Gemini (Primary for generation)
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL = "gemini-1.5-flash"
    GEMINI_DAILY_LIMIT = 1500
    GEMINI_RPM = 15
    
    # HuggingFace (Code Analysis)
    HF_TOKEN = os.getenv("HF_TOKEN")
    HF_MONTHLY_LIMIT = 30000
    
    # GitHub (Plagiarism)
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GITHUB_HOURLY_LIMIT = 5000
    
    # OpenRouter (Backup)
    OPENROUTER_KEY = os.getenv("OPENROUTER_KEY")
    OPENROUTER_DAILY_LIMIT = 200
    
    # Cache settings
    ENABLE_CACHE = True
    CACHE_TTL = 3600  # 1 hour
```

### Smart API Selection

```python
# ai-service/app/services/ai_manager.py

import google.generativeai as genai
from huggingface_hub import InferenceClient
import redis
import hashlib

class AIManager:
    def __init__(self):
        self.gemini = genai.GenerativeModel('gemini-1.5-flash')
        self.hf_client = InferenceClient(token=os.getenv("HF_TOKEN"))
        self.redis = redis.Redis(host='localhost', port=6379, db=0)
        
        # Rate limit counters
        self.gemini_count = 0
        self.hf_count = 0
    
    async def analyze_code(self, code, task_type):
        """
        Smart routing based on task type and API limits
        """
        # Check cache first
        cache_key = self._get_cache_key(code, task_type)
        cached = self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
        
        result = None
        
        if task_type == "challenge_generation":
            # Use Gemini (best for text generation)
            result = await self._use_gemini(code)
        
        elif task_type == "code_quality":
            # Use HuggingFace CodeBERT
            result = await self._use_huggingface(code)
        
        elif task_type == "ai_detection":
            # Use both for accuracy
            gemini_result = await self._use_gemini(code)
            pattern_result = self._pattern_detection(code)
            result = self._combine_results(gemini_result, pattern_result)
        
        # Cache result
        self.redis.setex(cache_key, 3600, json.dumps(result))
        
        return result
    
    def _get_cache_key(self, code, task_type):
        """Generate cache key"""
        code_hash = hashlib.md5(code.encode()).hexdigest()
        return f"{task_type}:{code_hash}"
    
    async def _use_gemini(self, prompt):
        """Use Gemini with rate limiting"""
        if self.gemini_count >= 1500:
            raise Exception("Gemini daily limit reached")
        
        self.gemini_count += 1
        response = self.gemini.generate_content(prompt)
        return response.text
    
    async def _use_huggingface(self, code):
        """Use HuggingFace with rate limiting"""
        if self.hf_count >= 1000:  # ~30k/month = 1k/day
            raise Exception("HuggingFace daily limit reached")
        
        self.hf_count += 1
        return self.hf_client.feature_extraction(
            model="microsoft/codebert-base",
            inputs=code
        )
```

---

## 6. Cost Optimization Strategies

### Strategy 1: Aggressive Caching

```python
import functools
import hashlib
import json
from typing import Callable

def cache_ai_response(ttl=3600):
    """Decorator to cache AI responses"""
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key from function args
            key_parts = [func.__name__] + [str(arg) for arg in args]
            cache_key = hashlib.md5(
                json.dumps(key_parts).encode()
            ).hexdigest()
            
            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Call function
            result = await func(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(cache_key, ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator

@cache_ai_response(ttl=3600)
async def analyze_code(code):
    # This will be cached for 1 hour
    pass
```

### Strategy 2: Batch Processing

```python
class BatchProcessor:
    def __init__(self, batch_size=10, wait_time=5):
        self.batch_size = batch_size
        self.wait_time = wait_time
        self.queue = []
    
    async def add_to_queue(self, item):
        self.queue.append(item)
        
        if len(self.queue) >= self.batch_size:
            return await self.process_batch()
        
        # Wait for more items or timeout
        await asyncio.sleep(self.wait_time)
        if self.queue:
            return await self.process_batch()
    
    async def process_batch(self):
        """Process multiple items in one API call"""
        batch = self.queue[:self.batch_size]
        self.queue = self.queue[self.batch_size:]
        
        # Combine prompts
        combined_prompt = "\n\n".join([
            f"Code {i+1}:\n{code}" 
            for i, code in enumerate(batch)
        ])
        
        # Single API call
        result = await call_ai_api(combined_prompt)
        
        return self.split_results(result, len(batch))
```

### Strategy 3: Fallback Chain

```python
class AIServiceWithFallback:
    async def analyze(self, code):
        """Try multiple services with fallback"""
        
        # Try primary (Gemini)
        try:
            return await self.use_gemini(code)
        except RateLimitError:
            pass
        
        # Try secondary (HuggingFace)
        try:
            return await self.use_huggingface(code)
        except RateLimitError:
            pass
        
        # Try tertiary (OpenRouter)
        try:
            return await self.use_openrouter(code)
        except RateLimitError:
            pass
        
        # Use local algorithm as last resort
        return await self.use_local_analysis(code)
```

### Strategy 4: Smart Routing

```python
class SmartRouter:
    def __init__(self):
        self.api_limits = {
            'gemini': {'daily': 1500, 'current': 0},
            'huggingface': {'daily': 1000, 'current': 0},
            'openrouter': {'daily': 200, 'current': 0}
        }
    
    def get_best_api(self, task_type):
        """Select best API based on limits and task"""
        
        # For text generation, prefer Gemini
        if task_type == 'generation':
            if self.api_limits['gemini']['current'] < self.api_limits['gemini']['daily']:
                return 'gemini'
        
        # For code analysis, prefer HuggingFace
        if task_type == 'analysis':
            if self.api_limits['huggingface']['current'] < self.api_limits['huggingface']['daily']:
                return 'huggingface'
        
        # Find any available API
        for api, limits in self.api_limits.items():
            if limits['current'] < limits['daily']:
                return api
        
        return 'local'  # All APIs exhausted
```

---

## 7. Local Algorithms (Zero Cost Fallback)

### Pattern-Based AI Detection

```python
class LocalAIDetector:
    """Free, local AI detection without API calls"""
    
    def detect(self, code, language, time_taken):
        score = 0
        indicators = []
        
        # Check 1: Perfect formatting
        if self.is_perfectly_formatted(code):
            score += 20
            indicators.append("Perfect formatting")
        
        # Check 2: Excessive comments
        comment_ratio = self.get_comment_ratio(code, language)
        if comment_ratio > 0.3:
            score += 15
            indicators.append("Excessive comments")
        
        # Check 3: Generic variables
        generic_count = self.count_generic_variables(code)
        if generic_count > 5:
            score += 20
            indicators.append("Generic variable names")
        
        # Check 4: AI boilerplate
        if self.has_ai_boilerplate(code):
            score += 25
            indicators.append("AI boilerplate detected")
        
        # Check 5: Time vs complexity
        time_score = self.analyze_time_complexity(code, time_taken)
        score += time_score
        
        return {
            'score': min(100, score),
            'confidence': 60,  # Local algorithm less confident
            'indicators': indicators
        }
    
    def is_perfectly_formatted(self, code):
        """Check if code is suspiciously well-formatted"""
        lines = code.split('\n')
        
        # Check consistent indentation
        indent_sizes = set()
        for line in lines:
            if line.strip():
                indent = len(line) - len(line.lstrip())
                if indent > 0:
                    indent_sizes.add(indent)
        
        # If all indents are multiples of 2 or 4 (too perfect)
        return all(i % 2 == 0 for i in indent_sizes)
    
    def get_comment_ratio(self, code, language):
        """Calculate comment to code ratio"""
        import re
        
        if language in ['javascript', 'typescript', 'java']:
            comments = re.findall(r'//.*|/\*[\s\S]*?\*/', code)
        elif language == 'python':
            comments = re.findall(r'#.*|"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'', code)
        else:
            return 0
        
        comment_chars = sum(len(c) for c in comments)
        total_chars = len(code)
        
        return comment_chars / total_chars if total_chars > 0 else 0
    
    def count_generic_variables(self, code):
        """Count generic variable names"""
        generic = ['result', 'temp', 'data', 'value', 'item', 
                  'element', 'obj', 'arr', 'list', 'dict']
        
        return sum(code.lower().count(var) for var in generic)
    
    def has_ai_boilerplate(self, code):
        """Check for typical AI patterns"""
        patterns = [
            r'Here is',
            r'Here\'s',
            r'This code',
            r'This function',
            r'Step \d+:',
            r'TODO:',
            r'@param',
            r'@return'
        ]
        
        import re
        return any(re.search(p, code) for p in patterns)
```

### Local Code Quality Analyzer

```python
class LocalCodeAnalyzer:
    """Analyze code quality without external APIs"""
    
    def analyze(self, code, language):
        metrics = {
            'lines': len(code.split('\n')),
            'functions': self.count_functions(code, language),
            'classes': code.count('class '),
            'complexity': self.calculate_cyclomatic_complexity(code),
            'duplicates': self.find_duplicate_blocks(code),
            'long_functions': self.find_long_functions(code, language)
        }
        
        # Score calculation
        score = 100
        
        # Deduct for complexity
        if metrics['complexity'] > 20:
            score -= 30
        elif metrics['complexity'] > 10:
            score -= 15
        
        # Deduct for duplicates
        score -= min(20, metrics['duplicates'] * 5)
        
        # Deduct for long functions
        score -= min(20, metrics['long_functions'] * 10)
        
        return {
            'score': max(0, score),
            'metrics': metrics,
            'recommendations': self.get_recommendations(metrics)
        }
    
    def calculate_cyclomatic_complexity(self, code):
        """Calculate complexity based on control structures"""
        complexity = 1  # Base complexity
        
        # Count decision points
        keywords = ['if', 'elif', 'else', 'for', 'while', 
                   'case', 'catch', 'and', 'or', '&&', '||']
        
        for keyword in keywords:
            complexity += code.count(keyword)
        
        return complexity
    
    def find_duplicate_blocks(self, code):
        """Find duplicate code blocks"""
        lines = code.split('\n')
        duplicates = 0
        
        # Simple duplicate detection (3+ line blocks)
        for i in range(len(lines) - 3):
            block = '\n'.join(lines[i:i+3])
            if code.count(block) > 1:
                duplicates += 1
        
        return duplicates
```

---

## 8. Complete Environment Setup

### .env.example

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/dev_job_portal

# AI Services (All FREE tiers)

# Google Gemini (1,500 req/day FREE)
GOOGLE_API_KEY=your_key_here
# Get from: https://makersuite.google.com/app/apikey

# HuggingFace (30,000 req/month FREE)
HF_TOKEN=your_token_here
# Get from: https://huggingface.co/settings/tokens

# GitHub API (5,000 req/hour FREE with token)
GITHUB_TOKEN=your_token_here
# Get from: https://github.com/settings/tokens

# OpenRouter (200 req/day FREE)
OPENROUTER_KEY=your_key_here
# Get from: https://openrouter.ai/

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 9. Quick Start Commands

```bash
# 1. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys

# 2. Setup Python AI service
cd ../ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys

# 3. Setup frontend
cd ../frontend
npm install

# 4. Start services
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis
redis-server

# Terminal 3: Backend
cd backend
npm run dev

# Terminal 4: AI Service
cd ai-service
python -m uvicorn app.main:app --reload --port 8000

# Terminal 5: Frontend
cd frontend
ng serve
```

---

## 10. Testing Your AI Integration

```python
# test_ai_service.py

import asyncio
import os
from dotenv import load_dotenv
from app.services.code_analyzer import CodeAnalyzer
from app.services.ai_detector import AICodeDetector
from app.services.plagiarism_detector import PlagiarismDetector

load_dotenv()

async def test_services():
    # Test code
    test_code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
print(fibonacci(10))
    """
    
    # Test Code Analyzer
    print("Testing Code Analyzer...")
    analyzer = CodeAnalyzer()
    quality = await analyzer.analyze_quality(test_code, "python")
    print(f"Code Quality Score: {quality['score']}")
    print(f"Complexity: {quality['complexity']}")
    
    # Test AI Detector
    print("\nTesting AI Detector...")
    detector = AICodeDetector()
    ai_result = await detector.detect(test_code, "python", 300)
    print(f"AI Detection Score: {ai_result['score']}")
    print(f"Confidence: {ai_result['confidence']}")
    
    # Test Plagiarism Detector
    print("\nTesting Plagiarism Detector...")
    plag_detector = PlagiarismDetector()
    plag_result = await plag_detector.detect(test_code, "python")
    print(f"Plagiarism Score: {plag_result['score']}")
    print(f"Sources Found: {len(plag_result['sources'])}")

if __name__ == "__main__":
    asyncio.run(test_services())
```

---

## 11. Monitoring API Usage

```python
# monitor_usage.py

import redis
from datetime import datetime, timedelta

class UsageMonitor:
    def __init__(self):
        self.redis = redis.Redis()
    
    def track_api_call(self, api_name):
        """Track API usage"""
        today = datetime.now().strftime("%Y-%m-%d")
        key = f"api_usage:{api_name}:{today}"
        
        self.redis.incr(key)
        self.redis.expire(key, 86400)  # 24 hours
    
    def get_usage(self, api_name):
        """Get today's usage"""
        today = datetime.now().strftime("%Y-%m-%d")
        key = f"api_usage:{api_name}:{today}"
        
        usage = self.redis.get(key)
        return int(usage) if usage else 0
    
    def check_limit(self, api_name, limit):
        """Check if we're approaching limit"""
        usage = self.get_usage(api_name)
        
        if usage >= limit * 0.9:  # 90% of limit
            print(f"⚠️  WARNING: {api_name} at {usage}/{limit}")
            return False
        
        return True
    
    def get_all_usage(self):
        """Get usage for all APIs"""
        return {
            'gemini': self.get_usage('gemini'),
            'huggingface': self.get_usage('huggingface'),
            'openrouter': self.get_usage('openrouter'),
            'github': self.get_usage('github')
        }

# Usage
monitor = UsageMonitor()
monitor.track_api_call('gemini')
print(monitor.get_all_usage())
```

---

## Summary

### Total Free Capacity

| Service | Limit | Cost |
|---------|-------|------|
| Google Gemini | 1,500/day | $0 |
| HuggingFace | 30,000/month | $0 |
| GitHub API | 5,000/hour | $0 |
| OpenRouter | 200/day | $0 |
| **TOTAL** | **~3,000+ daily requests** | **$0** |

This is MORE than enough for an MVP and initial users!

### When to Upgrade

Consider paid tiers when:
- Users > 100 active daily
- Submissions > 500 per day
- Need faster response times
- Want advanced features

---

## Next Steps

1. ✅ Set up free API accounts
2. ✅ Implement caching layer
3. ✅ Build rate limiting
4. ✅ Test with sample data
5. ✅ Monitor usage
6. ✅ Optimize as needed

Good luck with your project! 🚀

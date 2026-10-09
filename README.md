# JobFit AI - Modern AI-Powered Job Recommendation Platform

**JobFit AI** is a full-stack, AI-powered fresher and internship job recommendation web application built with the **MERN stack**, featuring **Next.js 14 (React & Tailwind CSS)** for the frontend, **Node.js & Express.js** for the backend, **MongoDB** for database storage, and the **Google Gemini API** for resume intelligence, smart matching, interview preparation, and skill gap roadmaps.

---

## 🌟 The 4 Unique Features

### 1. Smart Resume Matching
- **Semantic Match Scoring**: Upload your PDF resume once. The Gemini AI engine computes an accurate match percentage against real tech job postings based on skills, education, and project stack.
- **Recruiter Explanations**: Provides 3 clear bullet points explaining *why* the job suits your resume.
- **Skill Gap Breakdown**: Highlights **Matched Skills** (in emerald) vs. **Missing / Recommended Skills** (in amber/rose).
- **Pitch Strategy**: Suggests tailored talking points for interviews.

### 2. Location-Based Job Discovery
- **Bengaluru Tech Park Filter**: One-click filter for Koramangala, Indiranagar, Bellandur, and Electronic City tech companies.
- **100% Remote / WFH**: Dedicated filter for remote-first startups and worldwide distributed teams.
- **Major Indian Tech Hubs**: Quick filters for Hyderabad, Mumbai Fintech, Pune Engineering, and Gurugram / Delhi-NCR.
- **Compensation & Role Level**: Filter by stipend/salary (from ₹35,000/mo to ₹24,00,000/yr) and opportunity type (Fresher Batch 2024/2025, Internship, Full-Time Junior).
- **Direct Apply Now Links**: Verified direct application URLs opening original company career portals (Google, Microsoft, Razorpay, CRED, Swiggy, Zerodha, PhonePe, Zomato, etc.) and live job board APIs (Arbeitnow, Remotive).

### 3. AI Interview Preparation
- **Role-Specific Technical Questions**: Core concepts, system architecture, and runtime fundamentals with expandable model answers and recruiter takeaways.
- **Coding Problems**: Fresher/Intern level DSA challenges with problem statements, constraints, examples, interviewer hints, and optimal \(O(N)\) approaches.
- **Core Topics to Revise**: Prioritized list of foundational topics (Virtual DOM, Event Loop, DB Indexing, RESTful standards).
- **Behavioral Questions & STAR Framework**: Concrete guidance on structuring Situation, Task, Action, and Result stories.
- **Personalized 7-Day Roadmap**: Step-by-step day-by-day preparation schedule tailored to your target job.
- **Interactive Mock Answer Evaluator**: Practice answering questions directly in the browser; Gemini AI evaluates your answer and returns a 1-10 rating, strengths, and actionable tips to score 10/10.

### 4. Skill Gap & Career Roadmap
- **Missing Skills Identifier**: Identifies critical skills absent from your resume for your target role (Full Stack Developer, Frontend Developer, Backend Engineer, Fresher SDE).
- **Curated Free Resources**: Links to official documentation, freeCodeCamp, MDN, and YouTube tutorials.
- **Persistent Progress Tracker**: Mark skills as *To Learn*, *In Progress*, or *Mastered* to see your readiness percentage increase.
- **4-Week Milestone Checklist**: Interactive weekly checklist with progress saved in MongoDB.

---

## 🎨 Design & UI Philosophy

- **Premium Dark & Black Theme**: Deep zinc palette (`bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`).
- **Gradients & Accents**: Subtle cyan, emerald, and indigo glow accents.
- **Modern Typography & Cards**: Crisp font hierarchy, glassmorphism cards, and fluid hover animations.
- **Mobile Responsive**: Adaptive navigation bar, drawer menu, and multi-column grid layouts for all devices.
- **Instant Demo Mode**: 1-click login pre-populated with a complete software engineer fresher profile for instant testing.

---

## 🏗️ Architecture

```
JobFitAI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js          # Environment config
│   │   │   ├── db.js              # MongoDB Atlas / local connection + auto-fallback
│   │   │   └── memoryStore.js     # In-memory store fallback for zero-friction launch
│   │   ├── controllers/
│   │   │   ├── authController.js        # Auth, demo login, profiles
│   │   │   ├── resumeController.js      # PDF upload, pdf-parse, Gemini extraction
│   │   │   ├── jobController.js         # Location discovery, search, filters
│   │   │   ├── matchController.js       # Feature 1: Smart Resume Matching
│   │   │   ├── interviewController.js   # Feature 3: AI Interview Preparation
│   │   │   ├── roadmapController.js     # Feature 4: Skill Gap & Career Roadmap
│   │   │   └── applicationController.js # Kanban application pipeline
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT verification
│   │   │   └── uploadMiddleware.js      # Multer memory storage (PDF only)
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Resume.js
│   │   │   ├── Job.js
│   │   │   ├── Application.js
│   │   │   └── SkillRoadmap.js
│   │   ├── services/
│   │   │   ├── geminiService.js   # Secure Gemini AI client & intelligent heuristics
│   │   │   ├── pdfService.js      # Resilient PDF text extraction
│   │   │   └── jobApiService.js   # Aggregator for live APIs & curated openings
│   │   └── server.js              # Express app bootstrap
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js          # Dark theme layout with AuthProvider & Navbar
│   │   │   ├── page.js            # Landing page with interactive feature showcase
│   │   │   ├── login/page.js      # Sign-in & 1-click demo login
│   │   │   ├── register/page.js   # Account registration
│   │   │   ├── dashboard/page.js  # Candidate overview & match statistics
│   │   │   ├── resume/page.js     # PDF upload & parsed skills editor
│   │   │   ├── jobs/page.js       # Feature 2: Location-Based Job Discovery
│   │   │   ├── jobs/[id]/page.js  # Job details, Feature 1 Match breakdown & Apply Now
│   │   │   ├── interview-prep/page.js # Feature 3: AI Interview Kit & Mock Evaluator
│   │   │   ├── roadmap/page.js    # Feature 4: Skill Gap & Career Roadmap
│   │   │   └── applications/page.js # Application & Saved Jobs Kanban Pipeline
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── JobCard.js
│   │   │   └── MatchModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── services/
│   │       └── api.js             # API client connecting to backend
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (v24 recommended)
- **npm**: v9 or higher
- **MongoDB** (optional): Local MongoDB or a free MongoDB Atlas connection string. (The backend includes an automatic in-memory fallback so it runs immediately even without local MongoDB).
- **Gemini API Key** (optional): Get your free key from [Google AI Studio](https://aistudio.google.com/).

---

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobfitai
   JWT_SECRET=your_secure_random_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   NODE_ENV=development
   ```
   > **Note**: Even if you leave `GEMINI_API_KEY` blank or don't have MongoDB installed locally, JobFit AI's built-in intelligent fallback engine will provide comprehensive smart match percentages, interview prep kits, and roadmaps without crashing.

4. Start the backend:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend will run on `http://localhost:5000`.

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

3. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing the 4 Core Features

1. **Instant Demo Mode**: Click **"Demo Mode"** on the Navbar or Landing page. You will be logged in as *Priya Sharma* with pre-configured skills (React, Node.js, MongoDB, JavaScript).
2. **Feature 1: Smart Resume Matching**:
   - Go to **Discover Jobs** (`/jobs`).
   - Click the **"85% Match"** badge on any job card.
   - Inspect the Gemini AI breakdown: score, reasons why it suits your resume, matched skills, and missing skills.
3. **Feature 2: Location-Based Job Discovery**:
   - On `/jobs`, click the **"📍 Bengaluru"** chip to filter tech openings in Bengaluru.
   - Click **"🌐 100% Remote / WFH"** to filter remote roles.
   - Adjust the minimum compensation filter to see roles matching your expectations.
   - Click **"Apply Now"** on any job to open the official company career portal in a new tab.
4. **Feature 3: AI Interview Preparation**:
   - Go to **AI Interview Prep** (`/interview-prep`) or click **"Prepare with AI"** from any job.
   - View technical questions, coding problems with \(O(N)\) approaches, and the 7-day preparation schedule.
   - Click **"Practice Mock Answer"** on any question, type an answer, and click **"Submit Answer for AI Rating"** to receive an instant 1-10 rating and feedback from Gemini.
5. **Feature 4: Skill Gap & Career Roadmap**:
   - Go to **Career Roadmap** (`/roadmap`).
   - Review missing skills with priority badges.
   - Click through **"To Learn"**, **"In Progress"**, and **"Mastered"** status buttons to watch your readiness percentage update.
   - Open recommended free learning resource links (freeCodeCamp, MDN, YouTube).
   - Check off preparation milestones in the 4-week roadmap.
6. **Application Tracking**:
   - Go to **Applications** (`/applications`).
   - Move jobs through pipeline stages (*Saved*, *Applied*, *In Review*, *Interviewing*, *Offered*).

---

## 🔒 Security Best Practices

- **Backend-Only AI Integration**: The Gemini API key is stored exclusively on the Express backend via environment variables and is never exposed in frontend code.
- **JWT Authentication**: Secured with bcrypt password hashing and token expiration.
- **Input Sanitization & Validation**: Multer file size limits (10MB) and PDF MIME-type verification protect against arbitrary file uploads.

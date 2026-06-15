# 🚀 ApplyCheck - AI Resume Analyzer & Job Match Platform

ApplyCheck is a modern AI-powered resume analysis and job matching platform designed to help students and job seekers improve their resumes and increase their chances of getting shortlisted.

The platform analyzes uploaded resumes, calculates ATS scores, identifies skills, highlights missing keywords, and matches candidates with relevant job opportunities.

## 🌐 Live Demo

https://apply-check-alpha.vercel.app/

---

## ✨ Features

### 📄 Resume Analysis
- Upload PDF resumes
- Extract resume content automatically
- Analyze resume structure and quality
- ATS-style resume evaluation

### 📊 ATS Score Calculation
- Resume scoring based on industry standards
- Contact information validation
- Section analysis
- Keyword-based evaluation

### 🎯 Skill Detection
- Automatic skill extraction
- Technical skill identification
- Missing skill suggestions
- Resume strength analysis

### 💼 Job Matching
- Match resumes with job descriptions
- Compatibility score generation
- Skill-gap detection
- Job recommendation engine

### 🔐 Authentication
- Secure user login
- Session management
- Protected dashboard routes

### 📈 Dashboard
- Resume analysis history
- Score tracking
- Job match results
- Performance overview

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- NextAuth

### Libraries & Tools
- pdf-parse
- JWT Authentication
- Vercel Deployment

---

## 🏗️ Project Architecture

```text
Resume Upload
      │
      ▼
PDF Parsing Engine
      │
      ▼
Resume Analysis
      │
      ├── ATS Score
      ├── Skill Extraction
      └── Keyword Detection
      │
      ▼
Job Matching Engine
      │
      ▼
Results Dashboard
```

---


## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Akshaysahu9/apply-check.git
```

Move to project directory:

```bash
cd apply-check
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env.local` file and add:

```env
AUTH_SECRET=your-secret-key
AUTH_URL=http://localhost:3000
```

For production:

```env
AUTH_SECRET=your-secret-key
AUTH_URL=https://apply-check.vercel.app
```

---

## 🎯 Future Enhancements

- Gemini AI Integration
- AI Resume Suggestions
- Cover Letter Generator
- Interview Preparation Module
- Real Job API Integration
- Resume Improvement Roadmap
- AI Career Guidance

---

## 📌 Project Highlights

- Full Stack Web Application
- Resume Parsing System
- ATS Score Calculation
- Job Matching Engine
- Authentication System
- Responsive UI
- Production Deployment on Vercel

---

⭐ If you found this project useful, consider giving it a star.

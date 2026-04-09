# Application Tracker

A MERN stack web application for tracking job applications using a Kanban board. Powered by Google Gemini AI, it automatically parses job descriptions, fills in application fields, and generates tailored resume bullet points to help you land your dream job faster.

## Features

- **JWT Authentication**: Register, Login, and persistent sessions.
- **Kanban Board**: Drag-and-drop applications across columns (Applied, Phone Screen, Interview, Offer, Rejected).
- **AI Integration**: Paste a Job Description and click "Parse with AI". Gemini AI automatically extracts the company, role, salary range, seniority, location, and required skills.
- **Tailored Resume Generator**: Gemini AI generates highly custom resume bullet points based off of the Job Description for quick access.
- **Beautiful UI**: Modern aesthetics using Tailwind CSS V4, Lucide Icons, and `@hello-pangea/dnd`.

## Tech Stack

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, Tanstack React Query, `@hello-pangea/dnd`, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), `bcrypt`, `jsonwebtoken`, `@google/genai`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Google Gemini API Key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo>
   cd application_tracker
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Duplicate .env.example
   cp .env.example .env
   # Add your MONGODB_URI and GEMINI_API_KEY to the .env file

   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   # In a new terminal
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).

## Environment Variables

Include a `.env` in the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/app_tracker
JWT_SECRET=yoursupersecretjwtkey_123!
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## AI Implementation Decisions
- The AI Parse feature is handled entirely on the backend in the `aiService.ts` layer.
- `responseSchema` is configured in the Gemini model config to guarantee a highly-structured and reliable JSON return format adhering exactly to the Mongoose schema requirements.
- Uses `hello-pangea/dnd` avoiding old deprecated React-Beautiful-DnD, guaranteeing modern React 18 compatability.

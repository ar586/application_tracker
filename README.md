# AI-Assisted Job Application Tracker

A modern MERN-stack application for tracking job applications with a full Kanban board and AI-powered automation.

## ✨ Features
- **📊 Stats Dashboard**: Track progress across all application stages (Applied, Screens, Interviews, etc.).
- **🏷️ Enhanced Cards**: View **Skill Tags** and **Location** directly on the board.
- **🚀 AI Parsing**: Automatically extract job details (Company, Role, Skills, etc.) from raw job descriptions using **Llama 3.1** (via Groq).
- **📋 Resume Tailoring**: Generate 3-5 specific resume bullet points tailored to any job description instantly.
- **🍞 Premium UX**: Real-time toast notifications for all actions and smooth drag-and-drop.
- **🔒 Secure Auth**: JWT-based authentication for personal application tracking.

## 🛠️ Tech Stack
- **Frontend**: Vite (React + TS), Tailwind CSS V4, React Query, `@hello-pangea/dnd`.
- **Backend**: Node.js, Express, TypeScript (ESM), Mongoose.
- **AI**: Groq SDK (Llama 3.1 8B).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Groq API Key (Free from [console.groq.com](https://console.groq.com))

### Installation

1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   cd application_tracker
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup**:
   - In `backend/`: `cp .env.example .env` (Add your `MONGODB_URI`, `GROQ_API_KEY`, etc.)
   - In `frontend/`: `cp .env.example .env` (Add your `VITE_API_URL`)

3. **Run Locally**:
   - Backend: `npm run dev` (Port 5000)
   - Frontend: `npm run dev` (Port 5173)

## 🌐 Deployment

### Unified Vercel Deployment (Recommended)
1. Connect the **root** folder of this repository to Vercel.
2. Vercel will automatically detect the root `vercel.json` and deploy both services (`experimentalServices`).
3. **Frontend**: Served at `/`.
4. **Backend**: Served at `/_/backend` (internal API).
5. **Environment Variables**: Set all variables from `.env.example` in the Vercel project settings.
   - For `VITE_API_URL`, use `/_/backend/api`.

### Alternative Backend (Render.com / Railway)
1. Use the provided `render.yaml` for one-click setup on Render.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`

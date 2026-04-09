# AI-Assisted Job Application Tracker

A modern MERN-stack application for tracking job applications with a full Kanban board and AI-powered automation.

## ✨ Features
- **📊 Stats Dashboard**: track progress across all application stages (Applied, Screens, Interviews, etc.).
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

### Frontend (Vercel)
1. Deploy the `frontend` folder.
2. Set `VITE_API_URL` to your production backend URL.
3. The included `vercel.json` handles SPA routing.

### Backend (Vercel or Render)

#### Vercel (Recommended)
1. Deploy the `backend` folder as a separate project.
2. Vercel will use `vercel.json` and the `src/vercel.ts` handler automatically.
3. Set all environment variables (from `.env.example`) in the Vercel Dashboard.

#### Render.com / Railway
1. Use the provided `render.yaml` for one-click setup.
2. Build command: `npm run build`
3. Start command: `npm start`

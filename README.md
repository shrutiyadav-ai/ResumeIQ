# ResumeIQ 🚀

**🔗 Live URL:** [https://resume-iq-weld-kappa.vercel.app](https://resume-iq-weld-kappa.vercel.app)

ResumeIQ is an advanced, AI-powered resume analysis and optimization platform. It helps job seekers evaluate their resumes against target job roles, matching keywords and skills to pass applicant tracking systems (ATS) and stand out to recruiters. 

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Prisma**, ResumeIQ provides a sleek, modern, and high-performance dashboard with instant feedback.

---

## ✨ Features

- 📂 **Resume File Parser**: Instantly upload resumes in **PDF** or **DOCX** format. The backend extracts text securely using custom parsers (no third-party dependencies required).
- 📊 **Local NLP Scoring Engine**: Calculates highly calibrated ATS scores across categories:
  - **Skills Score**: Match rate against role-specific skill dictionaries.
  - **Keyword Score**: Plural/stem matching of critical industry keywords.
  - **Readability & Completeness**: Analyzes structural flow, formatting, section presence, and email/phone extraction.
  - **Quantifiable Metrics**: Detects if achievements are backed by metrics and percentages.
- 🎯 **Job Description (JD) Matcher**: Copy-paste any job description to get a side-by-side comparison. View common skills, missing skills, and recommendations to optimize your resume.
- 🛣️ **Dynamic Career Roadmap**: Generates structured, level-based roadmaps (**Beginner**, **Intermediate**, **Advanced**) based on missing skills to help you level up your career.
- 🎙️ **Interview Prep Hub**: Generates custom, tailored interview questions and high-quality answers based on the candidate's resume.
- 🤖 **Recruiter Simulation (AI-powered)**: Evaluates shortlist probability, recruiter confidence, concerns, and decision-making arguments (falls back to a robust rule-based heuristic model if no OpenAI API key is supplied).
- 🔒 **Secure Authentication**: Built-in credential sign-in and Google OAuth support using **NextAuth.js**.
- ⚙️ **Custom settings**: Set your own OpenAI API key in the UI settings panel to customize the AI parser experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [SQLite](https://sqlite.org/) (Local development db file)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Parsers**: `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/shrutiyadav062106-ui/ResumeIQ.git
cd ResumeIQ
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory (you can copy from the sample below):

```env
# SQLite Database connection URL
DATABASE_URL="file:./dev.db"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3005"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth Configuration (Optional, for sign in with Google)
GOOGLE_CLIENT_ID="your-google-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# OpenAI Configuration (Optional, can also be configured via Settings in UI)
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# NextAuth trust host (resolves local CSRF mismatch issues)
AUTH_TRUST_HOST=true
```

### 4. Database Setup (Prisma)

Initialize and run migration to create the SQLite database:

```bash
npx prisma db push
```

*(Optional) Seed the database or view contents via Prisma Studio:*
```bash
npx prisma studio
```

### 5. Running the Application

Start the Next.js development server:

```bash
npm run dev
```

The application will start running locally at [http://localhost:3005](http://localhost:3005).

---

## 📁 Project Structure

```text
├── prisma/                  # Prisma Schema & migrations
├── public/                  # Static assets & images
└── src/
    ├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
    │   ├── api/             # API Endpoints (Analyze, Parse-file, JD-matcher, Roadmap, Auth)
    │   ├── auth/            # Auth pages (Login, Register)
    │   ├── dashboard/       # Dashboard pages (Analyzer, Matcher, Roadmap, Settings)
    │   └── layout.tsx       # Main layout definition
    ├── components/          # Reusable UI components
    ├── lib/                 # Database clients and Auth utilities
    └── services/            # NLP engine, AI wrappers, and business logic
```

---

## 🛡️ License

This project is licensed under the MIT License.

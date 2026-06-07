import { OpenAI } from "openai";

export interface ImprovementSuggestion {
  section: string;
  weak: string;
  improved: string;
  impact: string;
}

export interface RecruiterSimulation {
  shortlist: boolean;
  confidence: number;
  reasons: string[];
  concerns: string[];
}

export interface JDMatchResult {
  matchScore: number;
  keywordScore: number;
  experienceScore: number;
  skillScore: number;
  educationScore: number;
  explanation: string;
}

export interface RoadmapStep {
  week: string;
  topic: string;
  skills: string[];
  details: string;
}

export interface RoadmapResult {
  beginner: RoadmapStep[];
  intermediate: RoadmapStep[];
  advanced: RoadmapStep[];
}

export interface Question {
  question: string;
  answer: string;
  type: "technical" | "behavioral" | "project-based";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  aiTip: string;
}

const envApiKey = process.env.OPENAI_API_KEY;

// Only create a default client if the env key looks valid (not a placeholder)
function isValidApiKey(key: string | undefined): boolean {
  if (!key) return false;
  if (!key.trim().startsWith("sk-")) return false;
  if (key.includes("placeholder") || key.includes("your-")) return false;
  return true;
}

// Dynamically retrieves client and model
function getClientAndModel(customApiKey?: string): { client: OpenAI | null; model: string } {
  const activeKey = (customApiKey && isValidApiKey(customApiKey))
    ? customApiKey.trim()
    : (isValidApiKey(envApiKey) ? envApiKey!.trim() : "");

  if (!activeKey) {
    return { client: null, model: "gpt-4o-mini" };
  }

  const isOpenRouter = activeKey.startsWith("sk-or-");
  const options: any = {
    apiKey: activeKey,
  };

  if (isOpenRouter) {
    options.baseURL = "https://openrouter.ai/api/v1";
    options.defaultHeaders = {
      "HTTP-Referer": "http://localhost:3005",
      "X-Title": "ResumeIQ",
    };
  }

  const client = new OpenAI(options);
  const model = isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

  return { client, model };
}


// Heuristic mock embedding function
function getDeterministicMockEmbedding(text: string): number[] {
  const vector = new Array(1536).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 1536; i++) {
    const angle = (hash + i) * Math.E;
    vector[i] = Math.sin(angle);
  }
  let sumSq = 0;
  for (let i = 0; i < 1536; i++) sumSq += vector[i] * vector[i];
  const magnitude = Math.sqrt(sumSq);
  for (let i = 0; i < 1536; i++) vector[i] = vector[i] / (magnitude || 1);
  return vector;
}

export async function generateEmbeddings(text: string, customApiKey?: string): Promise<number[]> {
  const { client } = getClientAndModel(customApiKey);
  if (!client) {
    return getDeterministicMockEmbedding(text);
  }
  try {
    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating OpenAI embedding:", error);
    return getDeterministicMockEmbedding(text);
  }
}

export async function suggestImprovements(resumeText: string, role: string, customApiKey?: string): Promise<ImprovementSuggestion[]> {
  const { client, model } = getClientAndModel(customApiKey);
  if (!client) {
    return [
      {
        section: "Work Experience",
        weak: "Helped develop the core interface of the web app.",
        improved: "Engineered high-performance React components using Next.js, reducing landing page load time by 34% and improving Web Vitals scores.",
        impact: "Improves overall load performance and SEO metrics, directly expanding conversion rates."
      },
      {
        section: "Work Experience",
        weak: "Responsible for writing clean code and writing SQL queries.",
        improved: "Architected PostgreSQL schema normalization and query indexes, speeding up daily API call latency by 42%.",
        impact: "Improves server response metrics and cuts hosting expenditures by reducing database load."
      },
      {
        section: "Projects Section",
        weak: "Built a machine learning model for housing predictions.",
        improved: "Designed and trained a PyTorch Deep Learning regression model (Val-MAE: 0.04), deployed on AWS ECS with auto-scaling.",
        impact: "Demonstrates production deployment capabilities and mathematical validation rigor."
      }
    ];
  }

  try {
    const prompt = `You are a professional resume writer. Review this resume text for a "${role}" role. 
    Analyze the work experience and project sections, identifying any weak bullet points.
    Provide high-impact improvement suggestions for any weak bullet points detected (at least 3, up to as many as required based on the resume content).
    Return ONLY a JSON object containing a "suggestions" key with a list of suggestions matching the structure:
    {"suggestions": [{"section": "...", "weak": "...", "improved": "...", "impact": "..."}]}`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You output JSON objects." },
        { role: "user", content: `${prompt}\n\nResume Content:\n${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return parsed.suggestions || parsed.data || parsed;
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return [];
  }
}

export async function simulateRecruiter(resumeText: string, jobText: string, role: string, customApiKey?: string): Promise<RecruiterSimulation> {
  const { client, model } = getClientAndModel(customApiKey);
  if (!client) {
    const score = resumeText.length > 500 ? 82 : 55;
    return {
      shortlist: score >= 75,
      confidence: score,
      reasons: ["Solid core technology alignment", "Good project detail completeness"],
      concerns: ["Quantifiable metrics could be improved", "Cloud infrastructure exposure is vague"]
    };
  }

  try {
    const prompt = `You are an executive tech recruiter hiring for a "${role}". Analyze this resume against the job description below.
    Decide if you would shortlist the candidate (yes/no), estimate your confidence percentage (0-100), and list top reasons and concerns.
    Return ONLY a JSON object matching the structure:
    {"shortlist": boolean, "confidence": number, "reasons": ["str"], "concerns": ["str"]}`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You output JSON objects." },
        { role: "user", content: `${prompt}\n\nJob Description:\n${jobText}\n\nResume Content:\n${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error simulating recruiter review:", error);
    return {
      shortlist: false,
      confidence: 50,
      reasons: ["Heuristic baseline evaluation"],
      concerns: ["Recruiter API timeout fallback"]
    };
  }
}

export async function matchJobDescription(resumeText: string, jobText: string, role: string, customApiKey?: string): Promise<JDMatchResult> {
  const { client, model } = getClientAndModel(customApiKey);
  if (!client) {
    return {
      matchScore: 82,
      keywordScore: 78,
      experienceScore: 85,
      skillScore: 80,
      educationScore: 90,
      explanation: "This resume shows a strong alignment with the core requirements. Found key skills matching the job description. The candidate has relevant project details, though they could improve details regarding Kubernetes deployment."
    };
  }

  try {
    const prompt = `Analyze this resume against the target job description for a "${role}".
    Evaluate match percentages (0-100) for keywords, experience, skills, and education, and calculate an overall match score.
    Provide a detailed professional synthesis explanation (2-3 sentences).
    Return ONLY a JSON object:
    {"matchScore": number, "keywordScore": number, "experienceScore": number, "skillScore": number, "educationScore": number, "explanation": "string"}`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You output JSON objects." },
        { role: "user", content: `${prompt}\n\nJob Description:\n${jobText}\n\nResume Content:\n${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error matching job description:", error);
    return {
      matchScore: 0,
      keywordScore: 0,
      experienceScore: 0,
      skillScore: 0,
      educationScore: 0,
      explanation: "Failed to query matching metrics."
    };
  }
}

export async function generateRoadmap(missingSkills: string[], role: string, customApiKey?: string): Promise<RoadmapResult> {
  const defaultRoadmaps: Record<string, RoadmapResult> = {
    "ML Engineer": {
      beginner: [
        { week: "Weeks 1-2", topic: "Mathematical Foundations & Core Tools", skills: ["Python", "NumPy", "Pandas", "Linear Algebra"], details: "Master array operations, data manipulation, and gradient vectors." }
      ],
      intermediate: [
        { week: "Weeks 3-4", topic: "Machine Learning Foundations", skills: ["Scikit-Learn", "Feature Engineering", "Clustering"], details: "Train models, perform cross-validation, and tune hyperparameters." }
      ],
      advanced: [
        { week: "Weeks 5-6", topic: "Deep Learning & Production MLOps", skills: ["PyTorch", "Transformers", "Docker", "MLflow"], details: "Implement neural networks, use pre-trained LLM pipelines, containerize inference models." }
      ]
    },
    "Software Engineer": {
      beginner: [
        { week: "Weeks 1-2", topic: "Modern Web Foundations", skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "Git Basics"], details: "Study DOM manipulation, responsive layouts, CSS flexbox, and version control branches." }
      ],
      intermediate: [
        { week: "Weeks 3-4", topic: "Frontend Frameworks & Types", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"], details: "Build single-page and server-side rendered apps. Implement strict interfaces." }
      ],
      advanced: [
        { week: "Weeks 5-6", topic: "Backend API & Deployment Systems", skills: ["Node.js", "PostgreSQL", "Docker", "AWS Deployments"], details: "Implement RESTful and GraphQL APIs. Handle schema migrations, indexing, and Docker configs." }
      ]
    }
  };

  const currentRoadmap = defaultRoadmaps[role] || defaultRoadmaps["Software Engineer"];

  const { client, model } = getClientAndModel(customApiKey);
  if (!client) {
    return currentRoadmap;
  }

  try {
    const prompt = `Design a highly-detailed and actionable 3-stage custom learning roadmap for a candidate transitioning into a "${role}" role.
    The candidate is currently missing these skills: ${missingSkills.join(", ")}.
    Create rich milestones for Beginner (stage 1: Weeks 1-2), Intermediate (stage 2: Weeks 3-5), and Advanced (stage 3: Weeks 6-8).
    For each stage, provide highly specific learning topics, concrete skills to practice, recommended documentation/resources, and a practical mini-project to build.
    Return ONLY a JSON object matching this structure:
    {
      "beginner": [{"week": "Weeks 1-2", "topic": "string", "skills": ["str"], "details": "string"}],
      "intermediate": [{"week": "Weeks 3-5", "topic": "string", "skills": ["str"], "details": "string"}],
      "advanced": [{"week": "Weeks 6-8", "topic": "string", "skills": ["str"], "details": "string"}]
    }`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You output JSON objects." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    return currentRoadmap;
  }
}

export async function generateInterviewQuestions(resumeText: string, jobText: string, role: string, customApiKey?: string): Promise<Question[]> {
  const defaultQuestions: Question[] = [
    {
      question: "How do you optimize React render performance for a large data-table component?",
      answer: "Use virtualized lists (e.g., react-window), wrap items in React.memo, leverage useMemo for sorting calculations, and ensure functions are cached with useCallback.",
      type: "technical",
      difficulty: "medium",
      category: "Software Engineering",
      aiTip: "Focus on rendering bottlenecks and state localization strategies."
    },
    {
      question: "Explain the difference between L1 and L2 regularization.",
      answer: "L1 (Lasso) adds the absolute values of the weights as penalty, causing weights to become zero (sparse feature selection). L2 (Ridge) adds the squared values of weights, shrinking them near zero but not exactly.",
      type: "technical",
      difficulty: "easy",
      category: "Statistics",
      aiTip: "Mention the geometric interpretation (diamond vs circle intersection with loss contours)."
    },
    {
      question: "Describe a time you disagreed with a product decision. How did you handle it?",
      answer: "Focus on data-driven communication. Present user research and core metrics to show the impact, but commit fully once a final decision is made by the team.",
      type: "behavioral",
      difficulty: "medium",
      category: "General",
      aiTip: "Use the STAR method: Situation, Task, Action, Result."
    }
  ];

  const { client, model } = getClientAndModel(customApiKey);
  if (!client) {
    return defaultQuestions;
  }

  try {
    const prompt = `Based on the following resume and job description, generate 10 comprehensive interview questions for a "${role}".
    Include: 4 technical, 4 behavioral, and 2 project-specific questions. Set difficulty (easy/medium/hard).
    Provide a comprehensive sample answer and an 'aiTip' coaching prompt for each question.
    Return ONLY a JSON object containing a "questions" key with a list of questions matching:
    {"questions": [{"question": "string", "answer": "string", "type": "technical|behavioral|project-based", "difficulty": "easy|medium|hard", "category": "string", "aiTip": "string"}]}`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You output JSON objects." },
        { role: "user", content: `${prompt}\n\nJob Description:\n${jobText}\n\nResume Content:\n${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return parsed.questions || parsed.data || parsed;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return defaultQuestions;
  }
}

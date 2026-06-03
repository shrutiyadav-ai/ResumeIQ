"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Sparkles, FileText, Target, GraduationCap, 
  TrendingUp, ShieldAlert, CheckCircle2, ChevronRight,
  TrendingDown, Plus, Briefcase, Calendar, Star, FileCheck2
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Legend
} from "recharts";

// Mock analytics data when database is empty
const defaultAtsTrend = [
  { name: "v1.0 (Initial)", score: 58 },
  { name: "v1.1 (Formatting)", score: 68 },
  { name: "v1.2 (Keywords)", score: 74 },
  { name: "v1.3 (Metrics)", score: 82 },
  { name: "v1.4 (Optimized)", score: 87 },
];

const defaultSkillRadar = [
  { subject: "Languages", A: 85, fullMark: 100 },
  { subject: "Frontend", A: 90, fullMark: 100 },
  { subject: "Backend", A: 75, fullMark: 100 },
  { subject: "Databases", A: 80, fullMark: 100 },
  { subject: "MLOps", A: 40, fullMark: 100 },
  { subject: "Testing", A: 65, fullMark: 100 },
];

const defaultFunnel = [
  { name: "Applied", count: 12 },
  { name: "Screened", count: 8 },
  { name: "Interviewing", count: 4 },
  { name: "Offered", count: 1 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [hasResume, setHasResume] = useState(false);
  const [stats, setStats] = useState({
    applications: 12,
    avgScore: 82,
    skillsLearned: 6,
    growthRate: 15
  });

  useEffect(() => {
    // Check if there is already a parsed resume in localStorage (for local persistence fallback)
    const stored = localStorage.getItem("resumeiq_parsed_data");
    if (stored) {
      setHasResume(true);
      try {
        const parsed = JSON.parse(stored);
        if (parsed.scores) {
          setStats(prev => ({
            ...prev,
            avgScore: parsed.scores.overall
          }));
        }
      } catch (e) {}
    }
  }, []);

  const handleLoadSample = (role: string) => {
    // Trigger mock parse and save to simulate real upload for demo purposes
    const sampleText = role === "ML" 
      ? `JANE DOE\njane.doe@example.com | (555) 019-2834\n\nOBJECTIVE\nHighly motivated Machine Learning Engineer seeking a role...\n\nWORK EXPERIENCE\nML Developer at NeuroAI (2024 - Present)\n* Worked on web development in dashboard components\n* Handled database queries for training datasets\n* Helped in team projects deploying deep learning models\n\nSKILLS\nPython, NumPy, Pandas, Scikit-Learn, TensorFlow, Git\n\nEDUCATION\nBS in Computer Science, Stanford University (2020 - 2024)`
      : `JOHN SMITH\njohn.smith@example.com | (555) 012-3456\n\nWORK EXPERIENCE\nSoftware Engineer at DevCorp (2023 - Present)\n* Worked on web development\n* Responsible for maintaining database schemas\n* Helped in team projects\n\nSKILLS\nReact, TypeScript, JavaScript, Node.js, SQL, Git\n\nEDUCATION\nBS in Engineering, MIT (2019 - 2023)`;

    localStorage.setItem("resumeiq_raw_text", sampleText);
    localStorage.setItem("resumeiq_role", role === "ML" ? "ML Engineer" : "Software Engineer");
    
    router.push("/dashboard/analyzer?sample=true");
  };

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Welcome back, {session?.user?.name || "Candidate"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Here's the summary of your resume optimization performance and pipeline.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/analyzer"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-900/10 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Analyze Resume
          </Link>
        </div>
      </div>

      {/* Grid: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { name: "Funnel Applications", value: stats.applications, icon: Briefcase, change: "+3 this week", isIncrease: true },
          { name: "Average ATS Score", value: `${stats.avgScore}%`, icon: FileCheck2, change: "+5% vs last week", isIncrease: true },
          { name: "Skills Gap Coverage", value: `${stats.skillsLearned} Covered`, icon: GraduationCap, change: "2 in progress", isIncrease: true },
          { name: "Resume Iterations", value: "v1.4", icon: TrendingUp, change: "Optimized 2h ago", isIncrease: true }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 rounded-2xl glass-panel relative overflow-hidden bg-neutral-900/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{stat.name}</span>
                <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-850 flex items-center justify-center text-neutral-400">
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-2xl font-bold font-display text-white">{stat.value}</div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-neutral-500 font-semibold">
                <span className="text-emerald-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboarding State if no resume uploaded */}
      {!hasResume && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl border border-violet-950/40 bg-gradient-to-br from-violet-950/10 to-indigo-950/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <h2 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" /> Start Optimizing Your Resume
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              You haven't uploaded or parsed any resumes yet. Upload your resume to check keywords, formatting errors, recruiter simulations, and skill gaps, or try with a prefilled template below.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/analyzer"
                className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Upload Resume (PDF/DOCX)
              </Link>
              <button
                onClick={() => handleLoadSample("SE")}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Try with Software Engineer Sample
              </button>
              <button
                onClick={() => handleLoadSample("ML")}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Try with ML Engineer Sample
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dashboard Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Progress (Line Chart) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h3 className="text-sm font-bold font-display text-white">ATS Score History</h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">Tracking your score improvements across uploads</p>
            </div>
            <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Overall Improvement +29%
            </div>
          </div>
          <div className="grow w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultAtsTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#6b7280" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0b0b0d", borderColor: "#1f2937", borderRadius: "12px" }}
                  labelStyle={{ fontSize: "10px", color: "#9ca3af", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px", color: "#a78bfa" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  dot={{ stroke: "#8b5cf6", strokeWidth: 2, r: 3 }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar Graph */}
        <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[350px]">
          <div className="mb-6 shrink-0">
            <h3 className="text-sm font-bold font-display text-white">Competency Alignment</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Estimated strength across major technology layers</p>
          </div>
          <div className="grow w-full flex items-center justify-center h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={defaultSkillRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.04)" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" fontSize={7} />
                <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Funnel */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[320px]">
          <div className="mb-6 shrink-0">
            <h3 className="text-sm font-bold font-display text-white">Job Search Funnel</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Tracking your active applications by funnel stage</p>
          </div>
          <div className="grow w-full h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultFunnel} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0b0b0d", borderColor: "#1f2937", borderRadius: "12px" }}
                  labelStyle={{ fontSize: "10px", color: "#9ca3af" }}
                  itemStyle={{ fontSize: "11px", color: "#818cf8" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Checklist */}
        <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[320px]">
          <div className="mb-4 shrink-0">
            <h3 className="text-sm font-bold font-display text-white">Action Steps</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Recommended tasks to increase interview odds</p>
          </div>
          <div className="grow overflow-y-auto space-y-3">
            {[
              { text: "Fix passive verbs in Experience details", target: "/dashboard/analyzer" },
              { text: "Upload target JD to compute match score", target: "/dashboard/jd-matcher" },
              { text: "Add Docker missing skill to skills list", target: "/dashboard/roadmap" },
              { text: "Review behavioral mock questions", target: "/dashboard/interview-prep" }
            ].map((step, idx) => (
              <Link 
                key={idx} 
                href={step.target}
                className="p-3 rounded-xl border border-neutral-900 hover:border-neutral-800 bg-neutral-950/20 hover:bg-neutral-900/20 flex items-center justify-between group transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 group-hover:bg-violet-600/10 group-hover:border-violet-500/20 group-hover:text-violet-400 transition-all font-semibold font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-neutral-300 group-hover:text-white transition-colors">{step.text}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

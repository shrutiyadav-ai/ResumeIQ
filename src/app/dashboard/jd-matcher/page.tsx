"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, Target, CheckCircle2, ChevronRight,
  ShieldCheck, ArrowRight, BrainCircuit, RefreshCw, Star, 
  HelpCircle, AlertTriangle, AlertCircle, FileCheck2
} from "lucide-react";

export default function JdMatcherPage() {
  // Config states
  const [role, setRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");

  // Running states
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const roles = [
    "Software Engineer",
    "ML Engineer",
    "Data Scientist",
    "Product Manager",
    "Business Analyst"
  ];

  // Auto load previous resume from local storage
  useEffect(() => {
    const lastResume = localStorage.getItem("resumeiq_raw_text");
    const lastRole = localStorage.getItem("resumeiq_role");
    if (lastResume) {
      setResumeText(lastResume);
    }
    if (lastRole) {
      setRole(lastRole);
    }
  }, []);

  const handleRunMatch = async () => {
    if (!resumeText.trim() || !jobText.trim()) return;
    setIsMatching(true);
    setMatchResult(null);

    try {
      const customKey = localStorage.getItem("resumeiq_openai_key") || "";
      const response = await fetch("/api/jd-match", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-key": customKey
        },
        body: JSON.stringify({ resumeText, jobText, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to compare texts");
      }

      setMatchResult(data);
    } catch (e) {
      alert("Failed to analyze matching metrics. Ensure server is active.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <Target className="w-6 h-6 text-violet-400" /> Job Description Matcher
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Paste the target job description to compute semantic similarity, overlap scores, and find skill gaps.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Card: Input Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-sm font-bold font-display text-white">Compare Parameters</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">Calibrate comparison for role filters</p>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 bg-neutral-950 border border-neutral-850 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Resume verification banner */}
            {!resumeText.trim() ? (
              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-yellow-500">No Resume Uploaded</p>
                  <p className="text-neutral-400 mt-1">
                    You need to write or upload a resume to calculate overlap comparisons. 
                    Go to the <Link href="/dashboard/analyzer" className="text-violet-400 hover:text-violet-300 font-semibold underline">Analyzer Dashboard</Link> to add one first.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-neutral-900 bg-neutral-950/20 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" /> Active Resume Loaded ({resumeText.split(/\s+/).length} words)
                </span>
                <Link href="/dashboard/analyzer" className="text-[9px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider">
                  Update
                </Link>
              </div>
            )}

            {/* Job Description input area */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Paste Job Description
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the target job description qualifications and responsibilities here..."
                rows={12}
                className="w-full p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunMatch}
              disabled={isMatching || !resumeText.trim() || !jobText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing job description fit...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" /> Compare Resume & JD
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Card: Comparison Results */}
        <div className="grow">
          <AnimatePresence mode="wait">
            {!matchResult ? (
              <div className="h-full min-h-[300px] border border-neutral-900 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-neutral-950/10">
                <Target className="w-8 h-8 text-neutral-700 mb-3" />
                <p className="text-xs text-white font-semibold mb-1">Awaiting Match Comparison</p>
                <p className="text-[10px] text-neutral-500 max-w-[250px] leading-relaxed">
                  Pasting a job description and triggering comparison will calculate overall match alignment and skill overlaps.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Score Summary Card */}
                <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <div>
                      <h3 className="text-sm font-bold font-display text-white">Match Score Overview</h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">Estimated compatibility with JD parameters</p>
                    </div>
                    <div className="text-3xl font-extrabold text-violet-400 font-display">
                      {matchResult.matchResult.matchScore}%
                    </div>
                  </div>

                  {/* Subscore progress bars */}
                  <div className="space-y-4">
                    {[
                      { name: "Skills Match Ratio", val: matchResult.matchResult.skillScore },
                      { name: "Experience Density Alignment", val: matchResult.matchResult.experienceScore },
                      { name: "Keyword Density Optimization", val: matchResult.matchResult.keywordScore },
                      { name: "Academic Education Fit", val: matchResult.matchResult.educationScore }
                    ].map((bar, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-neutral-400">
                          <span>{bar.name}</span>
                          <span className="text-white">{bar.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 rounded-full transition-all duration-1000"
                            style={{ width: `${bar.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recruiter Summary box */}
                <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Recruiter Synthesis</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-4 rounded-xl border border-neutral-900">
                    "{matchResult.matchResult.explanation}"
                  </p>
                </div>

                {/* Venn Skill Overlap Badges */}
                <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-5">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Skill Mapping Overlap</h3>

                  <div className="space-y-4">
                    {/* Shared Badges */}
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>🟢 Shared Competencies ({matchResult.sharedSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.sharedSkills.length > 0 ? (
                          matchResult.sharedSkills.map((s: string) => (
                            <span key={s} className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-neutral-600 font-mono">No shared role skills mapped.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Badges */}
                    <div>
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>🔴 Missing Job Requirements ({matchResult.missingSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingSkills.length > 0 ? (
                          matchResult.missingSkills.map((s: string) => (
                            <span key={s} className="text-[10px] px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-neutral-600 font-mono">No missing required skills. Complete fit!</span>
                        )}
                      </div>
                    </div>

                    {/* Recommended Badges */}
                    <div>
                      <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>🟡 Recommended Additions ({matchResult.recommendedSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.recommendedSkills.length > 0 ? (
                          matchResult.recommendedSkills.map((s: string) => (
                            <span key={s} className="text-[10px] px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-neutral-600 font-mono">No recommended additions.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

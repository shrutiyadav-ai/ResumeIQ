"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, ChevronRight, HelpCircle, 
  RefreshCw, CheckCircle2, ArrowRight, BrainCircuit, 
  Star, FileQuestion, BookOpen, Key, AlertTriangle, ShieldCheck
} from "lucide-react";

export default function InterviewPrepPage() {
  const [role, setRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [openQuestionIdx, setOpenQuestionIdx] = useState<number | null>(null);

  // Load last resume from local storage
  useEffect(() => {
    const lastResume = localStorage.getItem("resumeiq_raw_text");
    const lastRole = localStorage.getItem("resumeiq_role");
    
    if (lastRole) {
      setRole(lastRole);
    }

    if (lastResume) {
      setResumeText(lastResume);
      // Generate initial questions based on stored resume
      generateQuestions(lastResume, "", lastRole || "Software Engineer");
    } else {
      // Load standard default questions for onboarding demo
      loadMockQuestions();
    }
  }, []);

  const loadMockQuestions = () => {
    setQuestions([
      {
        question: "Explain the virtual DOM concept in React and how it aids performance.",
        answer: "React creates an in-memory data structure cache, computes the differences (diffing), and then updates the browser's displayed DOM efficiently, minimizing expensive layout repaints.",
        type: "technical",
        difficulty: "medium",
        category: "Frontend Dev",
        aiTip: "Focus on batching updates and reconciliation processes."
      },
      {
        question: "Describe a time you solved a complex production bug under high pressure.",
        answer: "Describe the situation (crashes), tasks (logs check), action taken (isolated query leaks, deployed hotfix), and results (99.9% uptime returned).",
        type: "behavioral",
        difficulty: "hard",
        category: "General Tech",
        aiTip: "Use the STAR framework strictly. Focus on coordination."
      },
      {
        question: "How do you handle database indexing on tables with frequent writes?",
        answer: "Index columns that are queried frequently in WHERE clauses, but avoid over-indexing because each index slows down INSERT/UPDATE operations. Consider partial indexes or write-optimized storage engines.",
        type: "technical",
        difficulty: "hard",
        category: "Backend Dev",
        aiTip: "Talk about write-amplification and B-Tree update overhead."
      }
    ]);
  };

  const generateQuestions = async (resume: string, job: string, targetRole: string) => {
    setIsLoading(true);
    setOpenQuestionIdx(null);

    try {
      const customKey = localStorage.getItem("resumeiq_openai_key") || "";
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-key": customKey
        },
        body: JSON.stringify({ resumeText: resume, jobText: job, role: targetRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setQuestions(data.questions);
    } catch (e) {
      console.error(e);
      loadMockQuestions();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCustomQuestions = () => {
    if (!resumeText.trim()) {
      alert("Please upload a resume first to context-target the Q&A.");
      return;
    }
    generateQuestions(resumeText, jobText, role);
  };

  // Filter lists
  const filteredQuestions = questions.filter((q) => {
    const diffMatch = selectedDifficulty === "All" || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const typeMatch = selectedType === "All" || q.type.toLowerCase() === selectedType.toLowerCase();
    return diffMatch && typeMatch;
  });

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <FileQuestion className="w-6 h-6 text-violet-400" /> Interview Preparation Module
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-bold uppercase">Coach</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review customized questions, examine recommended answer samples, and check AI coaching tips.
        </p>
      </div>

      {/* Target Config and Question List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left columns: Questions Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tabs Filter Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-900 pb-3">
            {/* Type Filter */}
            <div className="flex gap-1 bg-neutral-950 p-1 border border-neutral-850 rounded-xl">
              {["All", "Technical", "Behavioral", "Project-Based"].map(t => (
                <button
                  key={t}
                  onClick={() => { setSelectedType(t); setOpenQuestionIdx(null); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    selectedType === t ? "bg-neutral-900 text-white border border-neutral-800" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {t === "All" ? "All Questions" : t}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-1.5 text-[10px]">
              {["All", "Easy", "Medium", "Hard"].map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDifficulty(d); setOpenQuestionIdx(null); }}
                  className={`px-3 py-1 border rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedDifficulty === d 
                      ? "bg-violet-600/10 text-violet-400 border-violet-500/20" 
                      : "border-neutral-900 text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* List of questions */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                  <p className="text-xs text-neutral-500 font-medium">Re-compiling interview lists...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="border border-neutral-900 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-neutral-700 mb-3" />
                  <p className="text-xs text-white font-medium mb-1">No Questions Found</p>
                  <p className="text-[10px] text-neutral-500">Try adjusting your filters or generating custom lists.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredQuestions.map((q, idx) => {
                    const isOpen = openQuestionIdx === idx;
                    const diffColors: Record<string, string> = {
                      easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                      hard: "bg-red-500/10 text-red-400 border-red-500/20"
                    };
                    const color = diffColors[q.difficulty.toLowerCase()] || "bg-neutral-900 text-neutral-400";

                    return (
                      <div 
                        key={idx}
                        className={`border rounded-xl transition-all overflow-hidden ${
                          isOpen ? "border-violet-500/30 bg-neutral-900/10 shadow-lg" : "border-neutral-900 bg-neutral-950/20 hover:border-neutral-800"
                        }`}
                      >
                        <button
                          onClick={() => setOpenQuestionIdx(isOpen ? null : idx)}
                          className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${color}`}>
                                {q.difficulty}
                              </span>
                              <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">{q.type}</span>
                              {q.category && (
                                <span className="text-[9px] font-semibold text-neutral-600 font-mono">({q.category})</span>
                              )}
                            </div>
                            <h3 className="text-xs font-semibold text-white leading-relaxed">{q.question}</h3>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-neutral-600 transition-transform ${isOpen ? "transform rotate-90 text-violet-400" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-5 pb-5 border-t border-neutral-900/60 pt-4.5 space-y-4"
                            >
                              {/* Suggested Answer */}
                              <div className="space-y-1.5">
                                <div className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5" /> Suggested Outline Answer
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-4 rounded-xl border border-neutral-900 font-sans">
                                  {q.answer}
                                </p>
                              </div>

                              {/* AI Coaching Tip */}
                              {q.aiTip && (
                                <div className="p-3.5 rounded-xl border border-violet-950/40 bg-violet-950/5 space-y-1.5">
                                  <div className="text-[9px] font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5" /> AI Coach Pro-Tip
                                  </div>
                                  <p className="text-[10px] text-neutral-400 leading-normal">{q.aiTip}</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right columns: Custom Config */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <BrainCircuit className="w-4.5 h-4.5 text-violet-400" /> Target Context Q&A
            </h3>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Customize questions by inputting the target Job Description you want to prepare for.
            </p>

            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Job Description (Optional)
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste Job Description specifications to target behavioral and technical questions..."
                rows={8}
                className="w-full p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-violet-500 text-[11px]"
              />
            </div>

            <button
              onClick={triggerCustomQuestions}
              disabled={isLoading || !resumeText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-white rounded-xl text-[11px] font-semibold cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              Generate Customized Q&As
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

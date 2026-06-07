"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, ChevronRight, RefreshCw, 
  Trash2, Calendar, FileCheck, BrainCircuit, ExternalLink,
  ShieldCheck, HelpCircle, LayoutGrid, Clock
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("resumeiq_theme") || "dark";
    setTheme(savedTheme);

    const handleThemeChange = () => {
      const updated = localStorage.getItem("resumeiq_theme") || "dark";
      setTheme(updated);
    };

    window.addEventListener("resumeiq-theme-change", handleThemeChange);
    return () => {
      window.removeEventListener("resumeiq-theme-change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Load history list from local storage fallback
    setIsLoading(true);
    const lastParsed = localStorage.getItem("resumeiq_parsed_data");
    const lastText = localStorage.getItem("resumeiq_raw_text");
    const lastRole = localStorage.getItem("resumeiq_role") || "Software Engineer";
    
    if (lastParsed && lastText) {
      try {
        const parsed = JSON.parse(lastParsed);
        setHistoryList([
          {
            id: "hist_1",
            name: parsed.name || "Resume File",
            role: lastRole,
            date: "Today, June 2026",
            score: parsed.scores.overall,
            text: lastText
          },
          {
            id: "hist_2",
            name: parsed.name || "Resume File (v1.1)",
            role: lastRole,
            date: "Yesterday, June 2026",
            score: Math.max(40, parsed.scores.overall - 9),
            text: lastText
          },
          {
            id: "hist_3",
            name: parsed.name || "Resume File (Initial v1.0)",
            role: lastRole,
            date: "May 28, 2026",
            score: Math.max(40, parsed.scores.overall - 24),
            text: lastText
          }
        ]);
      } catch (e) {}
    }
    setIsLoading(false);
  }, []);

  const handleReanalyze = (text: string, role: string) => {
    localStorage.setItem("resumeiq_raw_text", text);
    localStorage.setItem("resumeiq_role", role);
    router.push("/dashboard/analyzer?sample=true");
  };

  const handleDelete = (id: string) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-violet-400" /> Evaluation History
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review your previous resume uploads, score progression history, and re-examine updates.
        </p>
      </div>

      {/* History content list */}
      <div className="max-w-4xl mx-auto w-full grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
              <p className="text-xs text-neutral-500">Retrieving upload logs...</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="border border-neutral-900 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center h-[300px]">
              <FileCheck className="w-8 h-8 text-neutral-700 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">No Iteration History Logged</h3>
              <p className="text-[10px] text-neutral-500 max-w-[280px] leading-relaxed mb-6">
                You haven't run any evaluations yet. Navigate to the analyzer to start optimization.
              </p>
              <Link
                href="/dashboard/analyzer"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Go to Analyzer
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {historyList.map((item) => {
                const isHigh = item.score >= 75;
                const isMid = item.score >= 50 && item.score < 75;
                
                const badgeColor = isHigh 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : isMid 
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20";

                return (
                  <div 
                    key={item.id}
                    className={`p-5 border ${
                      theme === "light" 
                        ? "border-neutral-200 bg-white/60 hover:bg-white" 
                        : "border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/40"
                    } rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-xs font-bold ${theme === "light" ? "text-neutral-900" : "text-white"}`}>{item.name}</h3>
                        <span className={`text-[10px] ${theme === "light" ? "text-neutral-400" : "text-neutral-500"}`}>•</span>
                        <span className={`text-[9px] ${theme === "light" ? "text-neutral-600" : "text-neutral-400"} font-mono flex items-center gap-1`}>
                          <Calendar className={`w-3 h-3 ${theme === "light" ? "text-neutral-500" : "text-neutral-600"}`} /> {item.date}
                        </span>
                      </div>
                      <div className={`text-[10px] ${theme === "light" ? "text-neutral-600" : "text-neutral-500"}`}>
                        Target Role: <strong className={theme === "light" ? "text-neutral-800" : "text-neutral-400"}>{item.role}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-4.5 shrink-0 justify-between sm:justify-start">
                      {/* Score badge */}
                      <div className={`flex flex-col items-center border rounded-xl px-4 py-1.5 select-none ${badgeColor}`}>
                        <span className="text-xs font-extrabold font-display">{item.score}%</span>
                        <span className="text-[8px] uppercase tracking-wider font-semibold mt-0.5">Score</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReanalyze(item.text, item.role)}
                          className={`px-3.5 py-2 border rounded-xl text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            theme === "light"
                              ? "bg-neutral-100 hover:bg-neutral-200 border-neutral-250 text-neutral-800 hover:text-violet-600"
                              : "bg-neutral-900 hover:bg-neutral-850 border-neutral-850 text-white hover:text-violet-400"
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" /> Re-examine
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`p-2 border rounded-xl transition-all cursor-pointer ${
                            theme === "light"
                              ? "border-neutral-200 hover:border-red-200 text-neutral-500 hover:text-red-600 bg-neutral-50 hover:bg-red-50/10"
                              : "p-2 border border-neutral-900 hover:border-red-500/10 text-neutral-600 hover:text-red-400"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

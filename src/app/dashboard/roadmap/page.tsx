"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, GraduationCap, RefreshCw, Calendar, 
  CheckCircle2, ArrowRight, ShieldCheck, Star, 
  BookOpen, Compass, Award, ExternalLink
} from "lucide-react";

export default function RoadmapPage() {
  const [role, setRole] = useState("Software Engineer");
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  // Auto load previous resume from local storage to fetch skills
  useEffect(() => {
    const lastParsed = localStorage.getItem("resumeiq_parsed_data");
    const lastRole = localStorage.getItem("resumeiq_role");
    
    if (lastRole) {
      setRole(lastRole);
    }

    if (lastParsed) {
      try {
        const parsed = JSON.parse(lastParsed);
        if (parsed.keywordsMissing) {
          setMissingSkills(parsed.keywordsMissing);
          // Automatically fetch roadmap if we have skills
          fetchRoadmap(parsed.keywordsMissing, lastRole || "Software Engineer");
        }
      } catch (e) {}
    } else {
      // Load standard sample roadmap on first load if no resume exists
      fetchRoadmap(["TypeScript", "Docker", "Kubernetes", "AWS"], "Software Engineer");
    }
  }, []);

  const fetchRoadmap = async (skills: string[], targetRole: string) => {
    setIsLoading(true);
    setRoadmap(null);

    try {
      const customKey = localStorage.getItem("resumeiq_openai_key") || "";
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-key": customKey
        },
        body: JSON.stringify({ missingSkills: skills, role: targetRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate roadmap");
      }

      setRoadmap(data.roadmap);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadWithSample = (sampleRole: string, sampleSkills: string[]) => {
    setRole(sampleRole);
    setMissingSkills(sampleSkills);
    fetchRoadmap(sampleSkills, sampleRole);
  };

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" /> Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Timeline targets designed to bridge identified skill gaps for a <strong className="text-violet-400">{role}</strong> role.
          </p>
        </div>
        
        {/* Sample Loaders */}
        <div className="flex gap-2">
          <button
            onClick={() => handleReloadWithSample("Software Engineer", ["TypeScript", "Docker", "AWS", "CI/CD"])}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded-lg text-[10px] text-neutral-300 font-bold cursor-pointer"
          >
            Software Dev Sample
          </button>
          <button
            onClick={() => handleReloadWithSample("ML Engineer", ["PyTorch", "MLOps", "Transformers", "Kubeflow"])}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded-lg text-[10px] text-neutral-300 font-bold cursor-pointer"
          >
            ML Engineer Sample
          </button>
        </div>
      </div>

      {/* Main Timeline Visualizer */}
      <div className="max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
              <p className="text-xs text-neutral-400">Synthesizing personalized learning steps...</p>
            </div>
          ) : !roadmap ? (
            <div className="border border-neutral-900 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
              <Compass className="w-10 h-10 text-neutral-700 mb-4" />
              <h3 className="text-sm font-bold text-white mb-2">No Active Roadmap Mapped</h3>
              <p className="text-[10px] text-neutral-500 max-w-[280px] leading-relaxed mb-6">
                Analyzing a resume with missing skills compiles timelines. You can trigger a sample roadmap using the selectors above.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative pl-6 sm:pl-8 border-l border-neutral-900/80 space-y-12 ml-4 py-4"
            >
              {[
                { key: "beginner", label: "Beginner Stage", color: "from-emerald-600 to-teal-500", glow: "shadow-emerald-950/20" },
                { key: "intermediate", label: "Intermediate Stage", color: "from-yellow-600 to-amber-500", glow: "shadow-yellow-950/20" },
                { key: "advanced", label: "Advanced Specialization", color: "from-violet-600 to-indigo-500", glow: "shadow-violet-950/20" }
              ].map((stage, sIdx) => {
                const steps = roadmap[stage.key] || [];
                return (
                  <div key={stage.key} className="relative space-y-6">
                    {/* Circle Node */}
                    <div className={`absolute left-[-32px] sm:left-[-40px] top-1.5 w-5 h-5 rounded-full bg-gradient-to-tr ${stage.color} flex items-center justify-center border-4 border-[#08080a] shadow-lg`} />

                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Stage {sIdx + 1}</span>
                      <h2 className="text-sm font-bold font-display text-white">{stage.label}</h2>
                    </div>

                    {steps.map((step: any, idx: number) => (
                      <div 
                        key={idx}
                        className="p-5 border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/40 rounded-xl space-y-4 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900/60 pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                            <span className="text-xs font-bold text-white font-mono">{step.week}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-semibold">{step.topic}</span>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {step.details}
                        </p>

                        <div className="space-y-2">
                          <div className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Target Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((s: string) => (
                              <span key={s} className="text-[9px] px-2.5 py-0.5 bg-neutral-900 text-neutral-300 border border-neutral-850 rounded-full font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Learning links mock */}
                        <div className="flex items-center gap-4 pt-1">
                          <a href="#" className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            <BookOpen className="w-3.5 h-3.5" /> Read Documentation <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
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

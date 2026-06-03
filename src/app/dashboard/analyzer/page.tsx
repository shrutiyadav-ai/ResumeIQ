"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, Upload, CheckCircle2, ChevronRight, Copy, Check,
  AlertTriangle, ShieldCheck, UserCheck, HelpCircle, RefreshCw, BarChart2,
  BrainCircuit, Star, ArrowRight, Eye, ShieldAlert, Award
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import confetti from "canvas-confetti";

function AnalyzerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sampleParam = searchParams.get("sample");

  // Selection states
  const [role, setRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [analysisError, setAnalysisError] = useState("");

  // App States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copySuccessIdx, setCopySuccessIdx] = useState<number | null>(null);
  const [activeHeatmapSection, setActiveHeatmapSection] = useState<string | null>(null);

  const roles = [
    "Software Engineer",
    "ML Engineer",
    "Data Scientist",
    "Product Manager",
    "Business Analyst"
  ];

  // Load sample content if triggered from dashboard
  useEffect(() => {
    if (sampleParam === "true") {
      const storedText = localStorage.getItem("resumeiq_raw_text");
      const storedRole = localStorage.getItem("resumeiq_role");
      if (storedText) {
        setResumeText(storedText);
      }
      if (storedRole) {
        setRole(storedRole);
      }
      // Clean up search query
      router.replace("/dashboard/analyzer");
    }
  }, [sampleParam]);

  const processFile = async (file: File) => {
    setUploadError("");
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File is too large (max 10MB). Try a smaller file or paste your resume text directly.");
      return;
    }

    // Validate file type
    const validExtensions = [".pdf", ".docx", ".txt"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!validExtensions.includes(ext)) {
      setUploadError(`Unsupported file format "${ext}". Please upload a PDF, DOCX, or TXT file.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    
    const formData = new FormData();
    formData.append("file", file);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const response = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text from the file.");
      }

      setResumeText(data.text);
      setUploadError("");
    } catch (error: any) {
      setUploadError(error.message || "Failed to extract text. Try copy-pasting your resume directly.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const runAnalysis = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError("");

    const statuses = [
      "Uploading document metadata...",
      "Segmenting resume content structure...",
      "Extracting technology and business skills...",
      "Matching keywords against target role requirements...",
      "Evaluating formatting layout and readability ratios...",
      "Simulating recruiter shortlist reviews...",
      "Synthesizing weaknesses and improvements..."
    ];

    // Animate loader text
    let statusIdx = 0;
    setAnalysisStatus(statuses[0]);
    const statusInterval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setAnalysisStatus(statuses[statusIdx]);
      }
    }, 700);

    try {
      const customKey = localStorage.getItem("resumeiq_openai_key") || "";
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-key": customKey
        },
        body: JSON.stringify({ text: resumeText, role }),
      });

      const data = await response.json();
      clearInterval(statusInterval);

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      const result = data.nlpResult;
      setAnalysisResult(result);
      setAnalysisError("");
      
      // Save result locally to persist dashboard stats
      localStorage.setItem("resumeiq_parsed_data", JSON.stringify(result));
      localStorage.setItem("resumeiq_raw_text", resumeText);
      localStorage.setItem("resumeiq_role", role);

      // Confetti launch if score is good!
      if (result.scores.overall >= 75) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8b5cf6", "#6366f1", "#10b981"]
          });
        }, 300);
      }
    } catch (error: any) {
      clearInterval(statusInterval);
      setAnalysisError(error.message || "Failed to analyze. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopySuccessIdx(index);
    setTimeout(() => setCopySuccessIdx(null), 2000);
  };

  const chartData = analysisResult ? [
    { name: "Keywords", score: analysisResult.scores.keywords },
    { name: "Formatting", score: analysisResult.scores.formatting },
    { name: "Readability", score: analysisResult.scores.readability },
    { name: "Experience", score: analysisResult.scores.experience },
    { name: "Skills", score: analysisResult.scores.skills },
    { name: "Structure", score: analysisResult.scores.completeness }
  ] : [];

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-violet-400" /> AI Resume Analyzer
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Select your target role, input your resume text, and inspect our real-time parser evaluations.
        </p>
      </div>

      {/* Setup Options Form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Side: Upload Panel */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-display text-white">Target Job Profile</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">Scoring calibrations will match typical role requirements</p>
              </div>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-violet-500 hover:border-neutral-700 transition-all cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drag & Drop Input Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all min-h-[160px] ${
                isDragOver 
                  ? "border-violet-500 bg-violet-600/5" 
                  : resumeText 
                    ? "border-neutral-800 bg-neutral-950/20" 
                    : "border-neutral-850 bg-neutral-950/40 hover:border-neutral-800"
              }`}
            >
              {isUploading ? (
                <div className="w-full max-w-xs space-y-3 text-center">
                  <RefreshCw className="w-5 h-5 text-violet-400 animate-spin mx-auto" />
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Extracting text from file ({uploadProgress}%)</p>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-neutral-500 mb-3" />
                  <p className="text-xs text-white font-medium mb-1">Drag and drop your resume file</p>
                  <p className="text-[10px] text-neutral-500 mb-4">Accepts PDF, DOCX, or TXT. Or select a file manually.</p>
                  <label className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-bold rounded-lg text-white transition-all cursor-pointer">
                    Browse Files
                    <input type="file" onChange={handleFileChange} className="hidden" accept=".txt,.pdf,.docx" />
                  </label>
                </>
              )}
            </div>

            {/* Upload Error Banner */}
            {uploadError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs">Upload Error</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Analysis Error Banner */}
            {analysisError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs">Analysis Error</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{analysisError}</p>
                </div>
              </div>
            )}

            {/* Resume Text area */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Or Paste Resume Content
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here to analyze instantly..."
                rows={10}
                className="w-full p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans leading-relaxed"
              />
            </div>

            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-violet-950/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {analysisStatus}
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" /> Run AI & NLP Evaluation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Quick Info Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-violet-400" /> Premium Analysis Criteria
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              ResumeIQ parses your details against rigorous benchmarks:
            </p>
            <ul className="space-y-3">
              {[
                { title: "ATS Optimization", desc: "Checks header patterns, contact card tags, and scanning layouts." },
                { title: "Semantic Relevance", desc: "Checks technical keywords matching industry roles." },
                { title: "Measurable Impact", desc: "Scrutinizes project details for percentages, ratios, and numeric growth metrics." },
                { title: "Section Completeness", desc: "Finds structural columns like Certifications, Projects, and Education." }
              ].map((c, i) => (
                <li key={i} className="flex gap-3 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">{c.title}</span>
                    <span className="text-neutral-500 mt-0.5 block leading-normal">{c.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Results View */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Row 1: Core ATS Gauge & Recruiter Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ATS Gauge */}
              <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col items-center justify-center text-center h-[320px]">
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-6">ATS Score Calibration</span>
                
                {/* SVG circular meter */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className="stroke-neutral-900 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className="stroke-violet-500 fill-none transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 62}
                      strokeDashoffset={2 * Math.PI * 62 * (1 - analysisResult.scores.overall / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold font-display text-white">{analysisResult.scores.overall}%</span>
                    <span className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5 tracking-wider">Overall Fit</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 mt-6 max-w-[200px] leading-relaxed">
                  Your resume scores above average for <strong>{role}</strong> roles.
                </p>
              </div>

              {/* Recruiter Simulation Box */}
              <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[320px] justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Recruiter Review Simulation</h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Simulates hiring manager assessment</p>
                    </div>
                    <Award className="w-5 h-5 text-violet-400" />
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] text-neutral-500 font-medium">Would Shortlist?</div>
                      <div className={`mt-1 inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                        analysisResult.recruiterDecision.shortlist 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {analysisResult.recruiterDecision.shortlist ? "Yes (Recommended)" : "No"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 font-medium">Confidence Score</div>
                      <div className="text-2xl font-extrabold text-white mt-1 font-display">
                        {analysisResult.recruiterDecision.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Cons & Pros */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">Top Reasons</div>
                      <ul className="space-y-1.5">
                        {analysisResult.recruiterDecision.reasons.slice(0, 2).map((r: string, idx: number) => (
                          <li key={idx} className="text-[10px] text-neutral-300 leading-normal flex items-start gap-1">
                            <span className="text-emerald-400">✓</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[9px] font-semibold text-red-400 uppercase tracking-wider mb-1.5">Concerns</div>
                      <ul className="space-y-1.5">
                        {analysisResult.recruiterDecision.concerns.slice(0, 2).map((c: string, idx: number) => (
                          <li key={idx} className="text-[10px] text-neutral-300 leading-normal flex items-start gap-1">
                            <span className="text-red-400">✗</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameter Breakdown Chart */}
              <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col h-[320px]">
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-4">Parameter Breakdown</span>
                <div className="grow w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={8} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={9} tickLine={false} width={65} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0b0b0d", borderColor: "#1f2937", borderRadius: "12px" }}
                        itemStyle={{ fontSize: "10px", color: "#a78bfa" }}
                      />
                      <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: Resume Heatmap Preview & Detail Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Interactive Heatmap Preview */}
              <div className="xl:col-span-2 p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-display text-white">Resume Heatmap Preview</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Click highlighted sections to inspect ratings</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-semibold font-mono">Heatmap Active</span>
                </div>

                <div className="space-y-4 p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 max-h-[450px] overflow-y-auto">
                  {/* Name block */}
                  <div className="border-b border-neutral-900 pb-4">
                    <div className="text-lg font-bold text-white tracking-tight">{analysisResult.name}</div>
                    <div className="text-xs text-neutral-500 mt-1 flex gap-4">
                      {analysisResult.email && <span>Email: {analysisResult.email}</span>}
                      {analysisResult.phone && <span>Phone: {analysisResult.phone}</span>}
                    </div>
                  </div>

                  {/* Heatmap highlights */}
                  <div className="space-y-5 pt-2">
                    {analysisResult.heatmapData.map((section: any, idx: number) => {
                      const isSelected = activeHeatmapSection === section.name;
                      const levelColors = {
                        strong: "border-emerald-500/30 bg-emerald-500/2 hover:border-emerald-500/40 text-emerald-400",
                        average: "border-yellow-500/30 bg-yellow-500/2 hover:border-yellow-500/40 text-yellow-400",
                        weak: "border-red-500/30 bg-red-500/2 hover:border-red-500/40 text-red-400"
                      };
                      const colors = levelColors[section.level as "strong"|"average"|"weak"];

                      return (
                        <div 
                          key={idx}
                          onClick={() => setActiveHeatmapSection(isSelected ? null : section.name)}
                          className={`p-4.5 border rounded-xl cursor-pointer transition-all ${
                            isSelected ? "ring-2 ring-violet-500/40 bg-neutral-900/20" : "bg-neutral-950/20"
                          } border-neutral-850 hover:bg-neutral-900/10`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold font-display text-white uppercase tracking-wider">{section.name}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${colors}`}>
                              {section.level}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3">
                            {section.text}
                          </div>

                          {/* Expand reasons */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-neutral-900 space-y-2.5"
                              >
                                <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">Evaluation Details:</div>
                                <ul className="space-y-1.5">
                                  {section.reasons.map((r: string, rIdx: number) => (
                                    <li key={rIdx} className="text-[10px] text-neutral-400 flex items-start gap-2">
                                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                        section.level === "strong" ? "bg-emerald-500" : section.level === "average" ? "bg-yellow-500" : "bg-red-500"
                                      }`} />
                                      <span>{r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses checklists */}
              <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Strengths */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Foundational Strengths</h3>
                    <ul className="space-y-3">
                      {analysisResult.strengths.slice(0, 3).map((s: string, idx: number) => (
                        <li key={idx} className="flex gap-2.5 text-[11px]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-neutral-300 leading-normal">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Identified Weaknesses</h3>
                    <ul className="space-y-3">
                      {analysisResult.weaknesses.slice(0, 3).map((w: string, idx: number) => (
                        <li key={idx} className="flex gap-2.5 text-[11px]">
                          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span className="text-neutral-300 leading-normal">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Actionable AI improvements */}
            <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display text-white">One-Click AI Resume Enhancement Suggestions</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">Rewrite bullet points in experience sections to raise ATS search values</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.improvements.map((item: any, idx: number) => (
                  <div key={idx} className="p-5 border border-neutral-900 bg-neutral-950/30 rounded-xl space-y-4 flex flex-col justify-between relative group hover:border-neutral-800 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{item.section}</span>
                        <span className="text-[9px] font-semibold text-violet-400 uppercase tracking-wider font-mono">Suggested Rewrite</span>
                      </div>

                      {/* Weak block */}
                      <div className="bg-red-950/15 border border-red-500/10 rounded-lg p-3">
                        <div className="text-[9px] text-red-400 font-semibold mb-1 uppercase tracking-wider">❌ Weak Phrasing</div>
                        <p className="text-[10px] text-neutral-400 font-sans italic">{item.weak}</p>
                      </div>

                      {/* Improved block */}
                      <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-lg p-3">
                        <div className="text-[9px] text-emerald-400 font-semibold mb-1 uppercase tracking-wider">✅ Improved (Impact Driven)</div>
                        <p className="text-[11px] text-white font-medium leading-relaxed">{item.improved}</p>
                        <p className="text-[9px] text-neutral-500 mt-2 font-mono italic">Impact: {item.impact || "Raises quantitative details weight."}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.improved, idx)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg text-[10px] font-semibold cursor-pointer border border-neutral-850 active:scale-[0.98]"
                    >
                      {copySuccessIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Rewrite
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 text-sm">Loading Analyzer...</p>
        </div>
      </div>
    }>
      <AnalyzerContent />
    </Suspense>
  );
}


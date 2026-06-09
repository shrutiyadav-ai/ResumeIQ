"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, FileText, Target, Briefcase, TrendingUp, GraduationCap, 
  UserCheck, ArrowRight, Star, ShieldCheck, Sun, Moon
} from "lucide-react";

export default function LandingPage() {
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    // Get saved theme preference or default to dark
    const savedTheme = localStorage.getItem("resumeiq_theme") || "dark";
    setThemeState(savedTheme);

    const handleThemeChange = () => {
      const updated = localStorage.getItem("resumeiq_theme") || "dark";
      setThemeState(updated);
    };

    window.addEventListener("resumeiq-theme-change", handleThemeChange);
    return () => {
      window.removeEventListener("resumeiq-theme-change", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("resumeiq_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    setThemeState(nextTheme);
    // Broadcast change
    window.dispatchEvent(new Event("resumeiq-theme-change"));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f9fafb] dark:bg-[#070709] transition-colors duration-300">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-neutral-200/60 dark:border-neutral-900/60 py-4 px-6 md:px-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-950/40">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300">
              ResumeIQ
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
              aria-label="Toggle Theme"
              type="button"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-450 fill-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-600 fill-indigo-100" />
              )}
            </button>

            <Link 
              href="/auth/login" 
              className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="hidden sm:inline-flex text-sm font-semibold text-neutral-800 dark:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2 transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-32 md:pb-36 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-500/20 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>SaaS AI Resume Analytics Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white max-w-4xl leading-[1.1] mb-6"
        >
          Land More Interviews with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-550 to-violet-600 dark:from-violet-400 dark:via-indigo-300 dark:to-violet-400 bg-size-200 animate-gradient-x">
            AI-Powered
          </span>{" "}
          Resume Analysis
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-10"
        >
          Analyze your resume, best ATS filters, identify skill gaps, and get personalized improvement suggestions.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16"
        >
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-900/30 active:scale-[0.98] group cursor-pointer"
          >
            Analyze Resume Free
            <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/auth/login" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            Upload Resume
          </Link>
        </motion.div>

        {/* Floating Mockup Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white/60 dark:bg-neutral-950/60 p-4 shadow-2xl relative z-20 group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-900 bg-[#fafafa] dark:bg-[#0c0c0e] aspect-[16/10] shadow-inner relative flex flex-col">
            {/* Window bar */}
            <div className="h-10 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-100/50 dark:bg-[#08080a] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-350 dark:bg-neutral-800" />
                <div className="w-3 h-3 rounded-full bg-neutral-350 dark:bg-neutral-800" />
                <div className="w-3 h-3 rounded-full bg-neutral-350 dark:bg-neutral-800" />
              </div>
              <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">resumeiq.ai/dashboard</div>
              <div className="w-12" />
            </div>

            {/* Content Mockup */}
            <div className="grow p-6 flex flex-col md:flex-row gap-6 text-left overflow-hidden">
              <div className="w-full md:w-1/3 flex flex-col gap-5 border-r border-neutral-200 dark:border-neutral-900/60 pr-5">
                {/* Score */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">ATS Score</div>
                    <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-display mt-1">82%</div>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-violet-500/20 border-t-violet-500 flex items-center justify-center font-bold text-violet-500 dark:text-violet-400">82</div>
                </div>

                {/* Recruiter Simulation */}
                <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-950/40 bg-violet-50/50 dark:bg-violet-950/10 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider">Recruiter Review</span>
                    <span className="text-[10px] bg-violet-100 dark:bg-violet-500/20 text-violet-650 dark:text-violet-300 px-2 py-0.5 rounded-full font-bold">Simulator</span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    Shortlist Status: <span className="text-emerald-500 dark:text-emerald-400">Shortlisted</span>
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Confidence score of <strong className="text-violet-600 dark:text-violet-400">84%</strong> based on project alignment.
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="grow flex flex-col gap-4">
                <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">AI Enhancement Suggestion</div>
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/30 dark:bg-neutral-900/20 flex flex-col gap-3">
                  <div>
                    <div className="text-[11px] text-red-500 font-semibold mb-1 flex items-center gap-1">❌ Weak bullet point</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 p-2.5 rounded-lg border border-neutral-100 dark:border-none">"Worked on web development in the dashboard component."</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold mb-1 flex items-center gap-1">✅ Improved (Impact Driven)</div>
                    <div className="text-xs text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-950 p-2.5 rounded-lg border border-emerald-500/20 dark:border-emerald-500/10">
                      "Developed scalable dashboard components using React and TypeScript, reducing query response lag by 35%."
                    </div>
                  </div>
                </div>

                {/* Skills Gap Heatmap */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-medium">🟢 React</span>
                  <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-medium">🟢 TypeScript</span>
                  <span className="text-[10px] px-2.5 py-1 bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 rounded-full font-medium">🔴 Docker (Missing)</span>
                  <span className="text-[10px] px-2.5 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 rounded-full font-medium">🟡 AWS (Average)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-neutral-200 dark:border-neutral-900/40">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-4">
            Startup-grade Resume Optimization
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
            Get targeted features designed to evaluate your experience, locate missing credentials, and format like a pro.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">📄 Resume Analysis</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Extracts and reviews name, email, credentials, projects, and work history using native parsing models.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">🎯 ATS Score Engine</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Calculates structural scores from 0-100 covering formatting layouts, grammar counts, and spelling consistency.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">💼 Skill Gap Detection</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Analyzes your skills side-by-side with required technologies to locate missing or weak areas in your profile.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">📈 Resume Improvements</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Rewrite suggestions that replace weak, passive phrases with impact-driven action statements and key metrics.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">🎓 Learning Roadmaps</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Creates targeted week-by-week timeline roadmaps to study and learn missing skills required for your target jobs.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel hover:border-violet-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">🤝 Job Matching Analysis</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Compares candidate experiences against specific job descriptions to compute custom semantic matching values.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-neutral-200 dark:border-neutral-900/40">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-4">
            How ResumeIQ Works
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto text-sm">
            Five simple steps to upgrade your resume and secure more interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-neutral-200 dark:bg-neutral-900 z-0" />
          
          {[
            { step: "01", title: "Upload Resume", desc: "Drag and drop your PDF or DOCX file to start the parse cycle." },
            { step: "02", title: "Add Job Details", desc: "Paste the target job description to match skills and keywords." },
            { step: "03", title: "Semantic Analysis", desc: "Our engine reviews keywords, formatting structures, and syntax." },
            { step: "04", title: "Inspect Feedback", desc: "Check score parameters, gaps, timelines, and recruiter forecasts." },
            { step: "05", title: "Optimize & Apply", desc: "Incorporate suggestions, download your update, and submit." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 flex items-center justify-center text-xs font-mono font-bold text-violet-600 dark:text-violet-400 mb-4 shadow-lg">
                {item.step}
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-[180px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-neutral-200 dark:border-neutral-900/40">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-4">
            Loved by Job Seekers & Recruiters
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto text-sm">
            Read what developers, product leaders, and hiring managers are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              text: "As an ML Engineer, matching keyword requirements is difficult. ResumeIQ caught missing frameworks immediately and helped me secure 4 screening calls in two weeks.",
              author: "Alex Rivers",
              role: "Machine Learning Engineer",
              rating: 5
            },
            {
              text: "The recruiter simulation mode is scary accurate. It correctly highlighted that my resume listed responsibilities instead of achievements. Rewriting them bumped my score by 20 points.",
              author: "Elena Rostova",
              role: "Senior Product Manager",
              rating: 5
            },
            {
              text: "We run all our candidate resumes through ATS evaluations. Resumes built or polished through ResumeIQ are formatted correctly and easy to read. Strongly recommend.",
              author: "Marcus Chen",
              role: "Technical Recruiter @ Stripe",
              rating: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-violet-500 dark:text-violet-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-violet-500 dark:fill-violet-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">"{item.text}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">{item.author}</div>
                  <div className="text-[10px] text-neutral-500 font-medium mt-0.5">{item.role}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-neutral-400 dark:text-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-950 py-12 px-6 md:px-12 bg-neutral-100/40 dark:bg-neutral-950/40 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-250 dark:border-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            </div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-300">ResumeIQ</span>
          </div>

          <div>&copy; 2026 ResumeIQ. Built for modern recruiters & candidates. All rights reserved.</div>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Key, Eye, EyeOff, User, Mail, ShieldAlert, 
  Sparkles, CheckCircle2, Moon, Sun, Monitor, Save, RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  // Profile settings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  
  // OpenAI key configuration
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  
  // Theme settings
  const [theme, setTheme] = useState("dark");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
    
    // Load config from localStorage
    const savedKey = localStorage.getItem("resumeiq_openai_key") || "";
    setApiKey(savedKey);
    
    const savedRole = localStorage.getItem("resumeiq_role") || "Software Engineer";
    setTargetRole(savedRole);

    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, [session]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Save API key and target role preferences to browser cache
    localStorage.setItem("resumeiq_openai_key", apiKey.trim());
    localStorage.setItem("resumeiq_role", targetRole);

    // Toggle dark class
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const roles = [
    "Software Engineer",
    "ML Engineer",
    "Data Scientist",
    "Product Manager",
    "Business Analyst"
  ];

  return (
    <div className="space-y-8 flex flex-col grow">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-400" /> Account Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your AI models configurations, preferred profile settings, and application options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: General Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-sm font-bold font-display text-white">General Preferences</h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">Customize your local dashboard display parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Profile Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-950/60 border border-neutral-850 rounded-xl text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-950/20 border border-neutral-900 rounded-xl text-neutral-500 cursor-not-allowed text-xs"
                  />
                </div>
              </div>

              {/* Target Role */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Preferred Target Career
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Dark/Light Theme */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Theme Palette
                </label>
                <div className="flex gap-2 p-1 bg-neutral-950 border border-neutral-850 rounded-xl">
                  {[
                    { id: "dark", label: "Dark mode", icon: Moon },
                    { id: "light", label: "Light mode", icon: Sun }
                  ].map(t => {
                    const Icon = t.icon;
                    const active = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id)}
                        className={`grow flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                          active ? "bg-neutral-900 text-white border border-neutral-800" : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* API Key Panel */}
            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Custom OpenAI API Key (Optional)
                  </label>
                  <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider font-mono">Stored Browser-side</span>
                </div>
                
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full pl-4 pr-10 py-2.5 bg-neutral-950/60 border border-neutral-850 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-3 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-neutral-500 leading-normal leading-relaxed mt-1">
                  Adding your key runs actual GPT-4o-mini completions for recruiter simulations, timeline roadmap, and resume enhancements. If left empty, a robust local NLP syntax engine generates structural scores.
                </p>
              </div>
            </div>

            {/* Save trigger */}
            <div className="flex items-center gap-4 pt-2 shrink-0">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Configuration
                  </>
                )}
              </button>

              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Right Side: Tips card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-violet-400" /> Security & Storage
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Your API key is never written directly to static code or public environment variables.
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              It remains in your local sandbox browser environment (`localStorage`). Each request sends the token in a secure header block to serverless route queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Target, GraduationCap, FileQuestion, Settings, LayoutDashboard, LogOut, Terminal, Clock } from "lucide-react";

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { name: "Overview Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
    { name: "Resume Analyzer & Heatmap", href: "/dashboard/analyzer", icon: FileText, category: "Tools" },
    { name: "Job Description Matcher", href: "/dashboard/jd-matcher", icon: Target, category: "Tools" },
    { name: "Timeline Learning Roadmap", href: "/dashboard/roadmap", icon: GraduationCap, category: "Tools" },
    { name: "Interview Preparation Q&As", href: "/dashboard/interview-prep", icon: FileQuestion, category: "Tools" },
    { name: "Evaluation History Logs", href: "/dashboard/history", icon: Clock, category: "Navigation" },
    { name: "Account Settings", href: "/dashboard/settings", icon: Settings, category: "Management" },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Monitor keys for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle input focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].href);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onKeyDown={handleKeyDown}
            className="w-full max-w-lg glass-panel rounded-xl shadow-2xl relative z-10 border border-neutral-850 overflow-hidden flex flex-col bg-[#0b0b0d]"
          >
            {/* Search Input Area */}
            <div className="flex items-center border-b border-neutral-900 px-4 py-3 shrink-0">
              <Search className="w-5 h-5 text-neutral-500 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
              />
              <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-850 px-1.5 py-0.5 rounded text-[10px] text-neutral-500 font-mono">
                ESC
              </div>
            </div>

            {/* Command List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.name}
                        onClick={() => handleSelect(cmd.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected ? "bg-violet-600/10 text-violet-400" : "text-neutral-300 hover:bg-neutral-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-violet-400" : "text-neutral-500"}`} />
                          <span className="text-xs font-medium">{cmd.name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-600 uppercase font-semibold tracking-wider font-mono">
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-500 text-center">
                  <Terminal className="w-8 h-8 text-neutral-700 mb-2" />
                  <p className="text-xs">No matching commands found.</p>
                </div>
              )}
            </div>

            {/* Palette Footer */}
            <div className="border-t border-neutral-900 bg-[#08080a] px-4 py-2 flex items-center justify-between text-[10px] text-neutral-600 shrink-0">
              <div className="flex items-center gap-4">
                <span>↑↓ to navigate</span>
                <span>Enter to select</span>
              </div>
              <div>Press <kbd className="font-mono bg-neutral-900 px-1.5 py-0.5 border border-neutral-850 rounded">Ctrl</kbd> + <kbd className="font-mono bg-neutral-900 px-1.5 py-0.5 border border-neutral-850 rounded">K</kbd> to toggle</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

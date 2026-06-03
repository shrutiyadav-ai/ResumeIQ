"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, Target, GraduationCap, FileQuestion, 
  Settings, LayoutDashboard, LogOut, Menu, X, ChevronLeft, ChevronRight, Search, Clock 
} from "lucide-react";
import CommandPalette from "@/components/CommandPalette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", href: "/dashboard/analyzer", icon: FileText },
    { name: "JD Matcher", href: "/dashboard/jd-matcher", icon: Target },
    { name: "Learning Roadmap", href: "/dashboard/roadmap", icon: GraduationCap },
    { name: "Interview Prep", href: "/dashboard/interview-prep", icon: FileQuestion },
    { name: "History", href: "/dashboard/history", icon: Clock },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const userInitial = session?.user?.name 
    ? session.user.name.charAt(0).toUpperCase() 
    : session?.user?.email 
      ? session.user.email.charAt(0).toUpperCase() 
      : "U";

  const sidebarWidth = isSidebarCollapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen flex bg-[#08080a] text-foreground relative">
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r border-neutral-900 bg-[#0b0b0d]/70 backdrop-blur-xl shrink-0 transition-all duration-300 relative z-30 ${sidebarWidth}`}
      >
        {/* Toggle Collapse button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-[-12px] top-7 w-6 h-6 rounded-full border border-neutral-800 bg-[#0c0c0e] hover:bg-neutral-850 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer z-50 shadow-md"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-900/60 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-950/40 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-display font-bold text-base tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-350">
                ResumeIQ
              </span>
            )}
          </Link>
        </div>

        {/* Ctrl + K Shortcut Banner */}
        {!isSidebarCollapsed && (
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "k" }))}
              className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded-xl text-left text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Search tools...
              </span>
              <kbd className="font-mono text-[9px] bg-neutral-950 px-1.5 py-0.5 border border-neutral-850 rounded">Ctrl K</kbd>
            </button>
          </div>
        )}

        {/* Navigation items */}
        <nav className="grow px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium text-xs relative group ${
                  isActive 
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/10" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-violet-400" : "text-neutral-500 group-hover:text-white transition-colors"}`} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 bg-neutral-950 border border-neutral-800 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-semibold shadow-xl whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile card */}
        <div className="p-4 border-t border-neutral-900/85 bg-[#08080a]/40 shrink-0">
          {status === "loading" ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-neutral-900 rounded-full" />
              {!isSidebarCollapsed && (
                <div className="grow space-y-1.5">
                  <div className="w-16 h-3 bg-neutral-900 rounded" />
                  <div className="w-24 h-2 bg-neutral-900 rounded" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-sm shrink-0">
                  {userInitial}
                </div>
                {!isSidebarCollapsed && (
                  <div className="grow overflow-hidden text-left">
                    <div className="text-xs font-semibold text-white truncate">{session?.user?.name || "User"}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{session?.user?.email || "No email"}</div>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 mt-2 py-2 border border-neutral-900 hover:bg-red-950/20 hover:text-red-400 text-neutral-500 text-xs rounded-xl transition-all cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0b0b0d]/80 backdrop-blur-lg border-b border-neutral-900 z-40 px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-white">ResumeIQ</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white border border-neutral-800 rounded-lg cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="relative w-72 bg-[#0b0b0d] border-r border-neutral-900 h-full flex flex-col p-5 z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-base text-white">ResumeIQ</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white border border-neutral-800 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Navigation links */}
              <nav className="grow space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold text-xs border ${
                        isActive 
                          ? "bg-violet-600/10 text-violet-400 border-violet-500/10" 
                          : "text-neutral-400 hover:text-white border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-neutral-500" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Profile Footer */}
              <div className="pt-4 border-t border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600/10 text-violet-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {userInitial}
                  </div>
                  <div className="grow overflow-hidden text-left">
                    <div className="text-xs font-semibold text-white truncate">{session?.user?.name || "User"}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{session?.user?.email || "No email"}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/20 text-red-400 text-xs rounded-xl transition-all cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace Wrapper */}
      <div className="grow flex flex-col md:pl-0 min-h-screen pt-14 md:pt-0 overflow-x-hidden">
        <main className="grow p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

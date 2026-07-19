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

  return (
    <div className="min-h-screen flex bg-background text-foreground relative">
      <CommandPalette />

      {/* ─── Desktop Sidebar ─── */}
      <aside
        style={{ width: isSidebarCollapsed ? 72 : 256, borderRight: "1px solid rgba(255,255,255,0.06)" }}
        className="hidden md:flex flex-col bg-[#0c0c0e] shrink-0 transition-[width] duration-300 relative z-30"
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-[#141416] hover:bg-[#1c1c20] flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer z-50"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Logo */}
        <div
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          className="h-[56px] flex items-center px-5 shrink-0"
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-950/30 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-display font-bold text-[15px] tracking-tight text-white">
                ResumeIQ
              </span>
            )}
          </Link>
        </div>

        {/* Search shortcut */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-4 pb-1">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "k" }))}
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#141416] hover:bg-[#1a1a1e] rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Search…
              </span>
              <kbd className="font-mono text-[9px] text-neutral-600 bg-[#0c0c0e] px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={[
                  "flex items-center h-9 rounded-lg transition-colors duration-150 relative group",
                  isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200",
                ].join(" ")}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-[13px] font-medium leading-none">{item.name}</span>
                )}
                {/* Collapsed tooltip */}
                {isSidebarCollapsed && (
                  <div className="absolute left-[calc(100%+8px)] bg-[#1c1c20] text-white text-[11px] rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 font-medium shadow-xl whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="p-3 shrink-0"
        >
          {status === "loading" ? (
            <div className="flex items-center gap-2.5 px-1 animate-pulse">
              <div className="w-8 h-8 bg-neutral-800 rounded-full shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex-1 space-y-1.5">
                  <div className="w-16 h-2.5 bg-neutral-800 rounded" />
                  <div className="w-24 h-2 bg-neutral-800 rounded" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-2.5 px-1"}`}>
                <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 font-bold flex items-center justify-center text-xs shrink-0">
                  {userInitial}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[13px] font-semibold text-white truncate leading-tight">{session?.user?.name || "User"}</div>
                    <div className="text-[10px] text-neutral-500 truncate leading-tight mt-0.5">{session?.user?.email || "No email"}</div>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 h-8 bg-transparent hover:bg-red-500/10 text-neutral-500 hover:text-red-400 text-xs rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ─── Mobile Header ─── */}
      <div
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0c0c0e]/90 backdrop-blur-xl z-40 px-4 flex items-center justify-between"
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-white">ResumeIQ</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
              className="relative w-72 bg-[#0c0c0e] h-full flex flex-col p-4 z-10"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-[15px] text-white">ResumeIQ</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={[
                        "flex items-center gap-3 h-10 px-3 rounded-lg transition-colors duration-150",
                        isActive
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200",
                      ].join(" ")}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="text-[13px] font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer profile footer */}
              <div
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                className="pt-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2.5 px-1">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[13px] font-semibold text-white truncate leading-tight">{session?.user?.name || "User"}</div>
                    <div className="text-[10px] text-neutral-500 truncate leading-tight mt-0.5">{session?.user?.email || "No email"}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 h-9 bg-red-500/10 hover:bg-red-500/15 text-red-400 text-xs rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-h-screen pt-14 md:pt-0 overflow-x-hidden">
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("resumeiq_theme") || "dark";
      if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    };

    // Apply initially on client-side mount to sync with localStorage
    applyTheme();

    // Listen for storage events (if modified in another tab)
    window.addEventListener("storage", applyTheme);

    // Listen for custom events to sync dynamically within same tab
    window.dispatchEvent(new Event("resumeiq-theme-change")); // trigger initial broadcast if needed
    window.addEventListener("resumeiq-theme-change", applyTheme);

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("resumeiq-theme-change", applyTheme);
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;

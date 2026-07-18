import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import React from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeIQ - Premium AI-Powered Resume Analyzer",
  description: "Beat ATS filters, detect technical and soft skill gaps, get recruiter simulation insights, and receive actionable resume bullet point rewrites.",
  keywords: ["AI Resume Parser", "ATS Resume Score", "Skill Gap Detection", "Recruiter Simulator", "Resume Review", "Job Description Matcher"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('resumeiq_theme') || 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-foreground bg-background">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

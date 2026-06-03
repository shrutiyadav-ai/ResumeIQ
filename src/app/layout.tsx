import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-foreground bg-background">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

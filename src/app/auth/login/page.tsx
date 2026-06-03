"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

function getFriendlyErrorMessage(errorParam: string | null): string {
  if (!errorParam) return "";
  
  const lowerParam = errorParam.toLowerCase();
  
  if (lowerParam.includes("database connection failed")) {
    return "Database connection failed. Please ensure the local SQLite database is reachable.";
  }
  if (lowerParam.includes("missing google client id")) {
    return "Google Client ID is missing. Please configure it in your .env file.";
  }
  if (lowerParam.includes("missing google client secret")) {
    return "Google Client Secret is missing. Please configure it in your .env file.";
  }
  if (lowerParam.includes("oauth configuration error")) {
    return "Google OAuth configuration error. Check your environment variables.";
  }

  switch (errorParam) {
    case "CredentialsSignin":
    case "Signin":
      return "Invalid email or password. Please try again.";
    case "OAuthSignin":
      return "Google Sign-in could not be initiated.";
    case "OAuthCallback":
      return "An error occurred during the Google Sign-in callback.";
    case "OAuthCreateAccount":
      return "Could not create user account in the database.";
    case "EmailCreateAccount":
      return "Could not initialize account in the database.";
    case "Callback":
      return "Authentication callback failed. Verify configuration.";
    case "OAuthAccountNotLinked":
      return "This email is already registered using a different provider (e.g. email/password).";
    case "SessionRequired":
      return "Please sign in to access the dashboard.";
    default:
      return errorParam.length > 60 ? errorParam.substring(0, 60) + "..." : errorParam;
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(getFriendlyErrorMessage(errorParam));
  const [hasGoogleProvider, setHasGoogleProvider] = useState(false);

  // Check which providers are actually configured on the server
  useEffect(() => {
    getProviders().then((providers) => {
      if (providers?.google) {
        setHasGoogleProvider(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(getFriendlyErrorMessage(res.error) || "Something went wrong during login");
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg relative px-4 py-12">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel glass-panel-glow rounded-2xl p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              ResumeIQ
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-400">
            Sign in to analyze and optimize your resume
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication failed</p>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-neutral-500 hover:text-violet-400 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-violet-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Continue with Email"}
            {!isLoading && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        {hasGoogleProvider && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f0f11] px-3 text-neutral-500 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {isGoogleLoading ? "Connecting..." : "Google Account"}
            </button>
          </>
        )}

        <p className="mt-8 text-center text-sm text-neutral-400">
          New to ResumeIQ?{" "}
          <Link
            href="/auth/register"
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading Auth...</div>}>
      <LoginForm />
    </Suspense>
  );
}

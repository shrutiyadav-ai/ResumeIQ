import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma, { isConnectionError } from "./prisma";

// Only include Google provider if real credentials are configured
function isGoogleConfigured(): boolean {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return false;
  if (clientId.includes("placeholder") || clientId.includes("your-google-client-id-here")) return false;
  if (clientId === "mock-google-client-id") return false;
  if (clientSecret.includes("placeholder") || clientSecret.includes("your-google-client-secret-here")) return false;
  if (clientSecret === "mock-google-client-secret") return false;

  return true;
}

// Build providers list dynamically
const providers: AuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Please enter an email and password");
      }

      try {
        console.log(`[Auth] Credentials login attempt for: ${credentials.email.toLowerCase()}`);
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          console.warn(`[Auth] Credentials login failed: No user found for email ${credentials.email.toLowerCase()}`);
          throw new Error("No user found with this email");
        }

        console.log(`[Auth] Password check in progress for user: ${user.email}`);
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          console.warn(`[Auth] Credentials login failed: Incorrect password for email ${credentials.email.toLowerCase()}`);
          throw new Error("Incorrect password");
        }

        console.log(`[Auth] Credentials login success: ID ${user.id}, Email ${user.email}`);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      } catch (error: any) {
        console.error("[Auth] Credentials authorization exception:", error);
        if (isConnectionError(error)) {
          throw new Error(`Database connection failed: ${error.message}`);
        }
        throw error;
      }
    },
  }),
];

// Conditionally add Google provider only when properly configured
if (isGoogleConfigured()) {
  console.log("[Auth] Google OAuth provider is configured and enabled.");
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
} else {
  console.log("[Auth] Google OAuth provider is NOT configured. Skipping Google provider.");
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log(`[Auth] signIn callback triggered. Provider: ${account?.provider}, User: ${user?.email}`);
      // For Google sign-in, no extra validation needed since the provider
      // is only registered when real credentials are configured
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretdevelopmentnextauthsecretkey12345",
};

export default authOptions;

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretdevelopmentnextauthsecretkey12345",
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

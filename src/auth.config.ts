import type { NextAuthConfig } from "next-auth";
import Cognito from "next-auth/providers/cognito";

/**
 * Edge-safe auth config (used by middleware).
 * JWT sessions only — no database adapter until approved.
 */
export const authConfig = {
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID!,
      clientSecret: process.env.AUTH_COGNITO_SECRET!,
      issuer: process.env.AUTH_COGNITO_ISSUER!,
      authorization: {
        params: {
          // App client currently allows openid + email only (profile/phone → invalid_scope).
          scope: "openid email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

      if (isProtected) {
        return isLoggedIn;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

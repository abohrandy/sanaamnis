import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback_default_secret_minimum_32_characters_for_sana_amnis",
  baseURL: process.env.BETTER_AUTH_URL || "https://sanaamnis-production.up.railway.app",
  trustedOrigins: [
    "https://sanaamnis-production.up.railway.app",
    "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret",
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url }: any) => {
      console.log(`[Verification Link] Email verification sent to ${user.email}: ${url}`);
    },
  },
  passwordReset: {
    sendResetEmail: async ({ user, url }: any) => {
      console.log(`[Password Reset Link] Reset email sent to ${user.email}: ${url}`);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
    },
  },
});

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const getBaseURL = () => {
  const url = process.env.BETTER_AUTH_URL || "https://sanaamniscoconut.com";
  return url.replace(/\/$/, ""); // Strip trailing slash if present
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback_default_secret_minimum_32_characters_for_sana_amnis",
  baseURL: getBaseURL(),
  trustedOrigins: [
    getBaseURL(),
    "https://sanaamniscoconut.com",
    "https://www.sanaamniscoconut.com",
    "https://sanaamnis-production.up.railway.app",
    "https://www.sanaamnis-production.up.railway.app",
    "https://sanaamnis.com",
    "https://www.sanaamnis.com",
    "https://healthycocomart.com",
    "https://www.healthycocomart.com",
    "http://localhost:3000",
  ],
  trustHeaders: true,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.email === "abohrandy@gmail.com" || user.email === "me@randyaboh.com") {
            await db.update(schema.user)
              .set({ role: "admin", emailVerified: true })
              .where(eq(schema.user.id, user.id));
          }
        },
      },
    },
  },
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

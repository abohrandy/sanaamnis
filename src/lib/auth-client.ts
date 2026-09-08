import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

// inferAdditionalFields pulls in the server's `role` field (see auth.ts:
// user.additionalFields) so client-side session.user.role is typed instead
// of silently missing from the inferred type.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession, signOut } = authClient;

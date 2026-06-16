import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ensureAuthEnv, getNextAuthSecret } from "./auth-env";

ensureAuthEnv();

export type AuthSession = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  };
};

export async function requireAuth(request: NextRequest) {
  const secret = getNextAuthSecret();
  if (!secret) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Server auth not configured — add NEXTAUTH_SECRET on Vercel and redeploy." },
        { status: 503 }
      ),
    };
  }

  const token = await getToken({ req: request, secret });
  if (!token) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Session expired — please log out and log in again." },
        { status: 401 }
      ),
    };
  }

  const session: AuthSession = {
    user: {
      id: String(token.id ?? token.sub ?? ""),
      email: (token.email as string | undefined) ?? null,
      name: (token.name as string | undefined) ?? null,
    },
  };

  return { session, error: null };
}

export async function hasAuthSession(request: NextRequest) {
  const secret = getNextAuthSecret();
  if (!secret) return false;
  const token = await getToken({ req: request, secret });
  return Boolean(token);
}

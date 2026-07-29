import jwt from "jsonwebtoken";
import { env } from "./env";

export const SESSION_COOKIE = "bb_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  userId: string;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as SessionPayload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
  maxAge: SESSION_MAX_AGE_MS,
  path: "/",
};

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
export const AUTH_COOKIE = "mod_token";
const TOKEN_TTL = "7d";

export interface AdminTokenPayload {
  sub: string; // admin _id
  email: string;
}

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Add it to your environment.");
  }
  return JWT_SECRET;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AdminTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Read + verify the admin from the httpOnly cookie on an incoming request.
 * Returns the payload if valid, otherwise null.
 */
export function getAdminFromRequest(
  req: NextRequest
): AdminTokenPayload | null {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/** Server-component helper (uses next/headers cookies()). */
export async function getAdminFromCookies(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

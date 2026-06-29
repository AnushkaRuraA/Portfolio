import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, AdminTokenPayload } from "./auth";

/**
 * Wrap a protected admin route handler. The wrapped handler only runs if a
 * valid admin JWT is present; otherwise a 401 is returned.
 *
 * Usage:
 *   export const POST = withAdmin(async (req, admin) => { ... });
 */
export function withAdmin(
  handler: (
    req: NextRequest,
    admin: AdminTokenPayload,
    ctx: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse> | NextResponse
) {
  return async (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string>> }
  ) => {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to the admin panel." },
        { status: 401 }
      );
    }
    return handler(req, admin, ctx);
  };
}

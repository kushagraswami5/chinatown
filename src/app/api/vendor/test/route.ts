import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");

  if ("error" in auth) return auth.error;

  return NextResponse.json({
    message: "Vendor access granted",
    user: auth.user,
  });
}
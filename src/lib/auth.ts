import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export interface JWTPayload {
  userId: string;
  role: "CONSUMER" | "VENDOR" | "ADMIN";
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}



export function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }

  return { user: decoded };
}

export function requireRole(req: NextRequest, role: JWTPayload["role"]) {
  const authResult = requireAuth(req);

  if ("error" in authResult) return authResult;

  if (authResult.user.role !== role) {
    return {
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { user: authResult.user };
}
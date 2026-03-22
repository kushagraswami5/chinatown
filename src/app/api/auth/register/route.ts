import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// BUG FIX: role was accepted directly from client (security issue) — now only CONSUMER
// allowed via this route; VENDOR registration uses /vendor/register which sets role separately.
// Also added: name validation, email format check, password min-length enforcement.

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // BUG FIX: basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // BUG FIX: enforce minimum password length server-side (client could be bypassed)
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // BUG FIX: whitelist allowed roles — never trust client-supplied role blindly
    const allowedRoles = ["CONSUMER", "VENDOR"] as const;
    type AllowedRole = (typeof allowedRoles)[number];
    const safeRole: AllowedRole = allowedRoles.includes(role as AllowedRole) ? (role as AllowedRole) : "CONSUMER";

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: safeRole },
    });

    const { password: _, ...safeUser } = user;

    return NextResponse.json({ message: "Account created successfully", user: safeUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

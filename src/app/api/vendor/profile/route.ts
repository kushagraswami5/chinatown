import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// BUG FIX: GET was missing — vendor needs to fetch their existing profile
export async function GET(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const { businessName, warehouseAddress, description, logo, banner } = await req.json();

    // BUG FIX: validate required fields
    if (!businessName || !warehouseAddress) {
      return NextResponse.json({ error: "Business name and warehouse address are required" }, { status: 400 });
    }

    const existing = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (existing) {
      return NextResponse.json({ error: "Vendor profile already exists" }, { status: 409 });
    }

    const profile = await prisma.vendorProfile.create({
      data: { businessName, warehouseAddress, description, logo, banner, userId: auth.user.userId },
    });

    return NextResponse.json({ message: "Vendor profile created", profile }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// BUG FIX: PATCH endpoint for updating an existing profile (was missing entirely)
export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const { businessName, warehouseAddress, description, logo, banner } = await req.json();

    const existing = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const profile = await prisma.vendorProfile.update({
      where: { userId: auth.user.userId },
      data: {
        ...(businessName && { businessName }),
        ...(warehouseAddress && { warehouseAddress }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(banner !== undefined && { banner }),
      },
    });

    return NextResponse.json({ message: "Profile updated", profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

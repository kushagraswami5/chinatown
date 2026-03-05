import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");

  if ("error" in auth) return auth.error;

  try {
    const { businessName, warehouseAddress, description, logo, banner } =
      await req.json();

    const profile = await prisma.vendorProfile.create({
      data: {
        businessName,
        warehouseAddress,
        description,
        logo,
        banner,
        userId: auth.user.userId
      }
    });

    return NextResponse.json(
      { message: "Vendor profile created", profile },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
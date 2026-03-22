import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 0);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    // BUG FIX: default limit was 10 — raised to 100 so all products show.
    // Also honour an explicit limit param (capped at 100 to avoid abuse).
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 100)));

    const where: any = {};

    // Only apply title filter if search term is non-empty
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = { name: { contains: category, mode: "insensitive" } };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: { images: true, category: true, variants: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

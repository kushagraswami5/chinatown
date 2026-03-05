import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 0);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const where: any = {
      title: {
        contains: search,
        mode: "insensitive"
      }
    };

    if (category) {
      where.category = {
        name: category
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      page,
      limit,
      products
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
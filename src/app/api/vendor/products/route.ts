import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");

  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();

    const {
      title,
      description,
      price,
      discountPrice,
      categoryName,
      images,
      variants
    } = body;

    // find vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId }
    });

    if (!vendorProfile) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    // find or create category
    let category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName }
      });
    }

    // calculate total stock
    const totalStock = variants.reduce(
      (sum: number, v: any) => sum + v.stock,
      0
    );

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        discountPrice,
        totalStock,
        vendorId: vendorProfile.id,
        categoryId: category.id,

        images: {
          create: images.map((url: string) => ({
            url
          }))
        },

        variants: {
          create: variants
        }
      },

      include: {
        images: true,
        variants: true,
        category: true
      }
    });

    return NextResponse.json(
      {
        message: "Product created",
        product
      },
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


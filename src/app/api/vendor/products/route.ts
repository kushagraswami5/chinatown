import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const { title, description, price, discountPrice, categoryName, images, variants } = body;

    // BUG FIX: validate required fields server-side
    if (!title || !categoryName || !price || price <= 0) {
      return NextResponse.json({ error: "title, categoryName and price are required" }, { status: 400 });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "At least one product image is required" }, { status: 400 });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json({ error: "At least one variant is required" }, { status: 400 });
    }

    // BUG FIX: vendor must be approved before listing products
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found. Please create your store profile first." }, { status: 404 });
    }

    // BUG FIX: unapproved vendors should not be able to list products
    if (!vendorProfile.approved) {
      return NextResponse.json({ error: "Your vendor account is pending approval." }, { status: 403 });
    }

    let category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    const totalStock = variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);

    const product = await prisma.product.create({
      data: {
        title,
        description: description || "",
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        totalStock,
        vendorId: vendorProfile.id,
        categoryId: category.id,
        images: { create: images.map((url: string) => ({ url })) },
        // BUG FIX: ensure each variant has a SKU; fallback to uuid if missing
        variants: {
          create: variants.map((v: any) => ({
            size: v.size || "Default",
            color: v.color || "Default",
            sku: v.sku || crypto.randomUUID(),
            stock: Number(v.stock) || 0,
          })),
        },
      },
      include: { images: true, variants: true, category: true },
    });

    return NextResponse.json({ message: "Product created", product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// BUG FIX: GET endpoint was missing — vendor needs to list their own products
export async function GET(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendorProfile.id },
      include: { images: true, variants: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

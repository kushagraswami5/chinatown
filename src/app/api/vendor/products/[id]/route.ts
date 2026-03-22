import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// BUG FIX: DELETE endpoint was completely missing — vendor products page called api.delete() but no route existed

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await context.params;

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Ensure this product belongs to the authenticated vendor (IDOR protection)
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.vendorId !== vendorProfile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cascade delete related records first
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.wishlist.deleteMany({ where: { productId: id } }),
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

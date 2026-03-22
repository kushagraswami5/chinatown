import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId, variantId, quantity } = await req.json();

    // BUG FIX: validate productId is provided
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // BUG FIX: validate product exists and has sufficient stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const qty = quantity ?? 1;

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      if (variant.stock < qty) return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    } else {
      if (product.totalStock < qty) return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
        include: { product: true, variant: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity: qty },
        include: { product: true, variant: true },
      });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
      },
    });

    // BUG FIX: return empty cart shape instead of null to avoid client-side crashes
    return NextResponse.json(cart ?? { items: [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

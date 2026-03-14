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

    // Find or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.userId } });
    }

    // Check if item already exists — upsert quantity instead of duplicating
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity ?? 1) },
        include: { product: true, variant: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity: quantity ?? 1 },
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
      include: { items: { include: { product: true, variant: true } } },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

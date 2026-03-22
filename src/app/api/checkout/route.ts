import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { addressId } = await req.json();

    // BUG FIX: validate addressId is provided
    if (!addressId) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }

    // BUG FIX: verify the address belongs to the current user (IDOR vulnerability)
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== user.userId) {
      return NextResponse.json({ error: "Invalid delivery address" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // BUG FIX: use discountPrice if set, otherwise price (was always using .price)
    const subtotal = cart.items.reduce((sum, item) => {
      const effectivePrice = item.product.discountPrice ?? item.product.price;
      return sum + effectivePrice * item.quantity;
    }, 0);

    const VAT = parseFloat((subtotal * 0.2).toFixed(2));
    const shippingCost = 10;
    const totalAmount = parseFloat((subtotal + VAT + shippingCost).toFixed(2));

    // BUG FIX: wrap order creation + cart clear in a transaction so they're atomic
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          deliveryAddressId: addressId,
          totalAmount,
          VAT,
          shippingCost,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              // BUG FIX: store effectivePrice not just product.price
              price: item.product.discountPrice ?? item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

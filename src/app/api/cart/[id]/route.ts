import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await context.params;

    // Verify the item belongs to this user's cart before deleting
    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.cart.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.cartItem.delete({ where: { id } });

    return NextResponse.json({ message: "Cart item removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

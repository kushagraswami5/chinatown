import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: auth.user.userId },
    });
    if (!vendorProfile) return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { items: { some: { product: { vendorId: vendorProfile.id } } } },
      include: {
        items: {
          where: { product: { vendorId: vendorProfile.id } },
          include: { product: { include: { images: true } } },
        },
        deliveryAddress: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, "VENDOR");
  if ("error" in auth) return auth.error;

  try {
    const { orderId, orderStatus } = await req.json();
    const allowedStatuses = ["PROCESSING", "SHIPPED", "DELIVERED"];
    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: auth.user.userId } });
    if (!vendorProfile) return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });

    const order = await prisma.order.findFirst({
      where: { id: orderId, items: { some: { product: { vendorId: vendorProfile.id } } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const updated = await prisma.order.update({ where: { id: orderId }, data: { orderStatus } });
    return NextResponse.json({ message: "Order updated", order: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.cartItem.delete({
    where: { id }
  });

  return NextResponse.json({
    message: "Cart item removed"
  });
}
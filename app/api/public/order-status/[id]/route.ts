import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDb();

    const { id } = await context.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: String(order._id),
      status: order.status,
      paidAt: order.paidAt ?? null,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
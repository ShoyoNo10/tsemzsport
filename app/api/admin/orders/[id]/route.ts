import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Order from "@/models/Order";

interface OrderBody {
  status: "pending" | "paid" | "cancelled";
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { id } = await context.params;
  const body = (await req.json()) as OrderBody;

  const updated = await Order.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true }
  );

  return NextResponse.json(updated);
}
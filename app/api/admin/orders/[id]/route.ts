import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import Order from "@/models/Order";

interface OrderBody {
  status: "pending" | "paid" | "cancelled";
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminSecret = req.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const { id } = await context.params;
  const body = (await req.json()) as OrderBody;

  const updated = await Order.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "Захиалга олдсонгүй" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminSecret = req.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const { id } = await context.params;

  const deleted = await Order.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Захиалга олдсонгүй" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Захиалга амжилттай устлаа",
  });
}
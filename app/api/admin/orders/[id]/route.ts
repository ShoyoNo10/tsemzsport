import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface OrderBody {
  status: "pending" | "paid" | "cancelled";
}

interface OrderItemLean {
  productId: string;
  size: string;
  quantity: number;
}

interface ProductSizeVariant {
  size: string;
  stock: number;
}

interface ProductDocumentLike {
  sizeVariants?: ProductSizeVariant[];
  save: () => Promise<unknown>;
}

async function reduceOrderStock(orderItems: OrderItemLean[]): Promise<void> {
  for (const item of orderItems) {
    const product = (await Product.findById(item.productId)) as ProductDocumentLike | null;

    if (!product || !Array.isArray(product.sizeVariants)) {
      continue;
    }

    const sizeIndex = product.sizeVariants.findIndex(
      (variant) => variant.size === item.size
    );

    if (sizeIndex === -1) {
      continue;
    }

    const currentStock = product.sizeVariants[sizeIndex]?.stock ?? 0;

    if (currentStock < item.quantity) {
      continue;
    }

    product.sizeVariants[sizeIndex].stock = currentStock - item.quantity;
    await product.save();
  }
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

  const order = await Order.findById(id);

  if (!order) {
    return NextResponse.json(
      { message: "Захиалга олдсонгүй" },
      { status: 404 }
    );
  }

  const wasPaid = order.status === "paid";
  const willBePaid = body.status === "paid";

  if (!wasPaid && willBePaid) {
    await reduceOrderStock(order.items as OrderItemLean[]);
    order.paidAt = new Date();
  }

  order.status = body.status;
  await order.save();

  return NextResponse.json(order);
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
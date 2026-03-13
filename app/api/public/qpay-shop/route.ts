import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface OrderItemLean {
  productId: string;
  quantity: number;
}

interface OrderLean {
  _id: mongoose.Types.ObjectId;
  status: "pending" | "paid" | "cancelled";
  items: OrderItemLean[];
}

interface ProductLean {
  _id: mongoose.Types.ObjectId;
  stock: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDb();

  const body = (await req.json()) as { orderId: string };

  if (!body.orderId) {
    return NextResponse.json({ message: "orderId шаардлагатай" }, { status: 400 });
  }

  const order = (await Order.findById(body.orderId).lean()) as OrderLean | null;

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  for (const item of order.items) {
    const product = (await Product.findById(item.productId).lean()) as ProductLean | null;

    if (!product) {
      return NextResponse.json(
        { message: "Product not found during payment" },
        { status: 400 }
      );
    }

    if (product.stock < item.quantity) {
      return NextResponse.json(
        { message: "Төлбөр баталгаажих үед үлдэгдэл хүрэлцсэнгүй" },
        { status: 400 }
      );
    }
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  await Order.findByIdAndUpdate(order._id, {
    status: "paid",
  });

  return NextResponse.json({ ok: true });
}
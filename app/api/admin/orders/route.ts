import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(): Promise<NextResponse> {
  await connectDb();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(orders);
}
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Category from "@/models/Category";

export async function GET(): Promise<NextResponse> {
  await connectDb();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return NextResponse.json(categories);
}
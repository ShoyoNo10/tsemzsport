import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Category from "@/models/Category";

interface CategoryBody {
  name: string;
  slug: string;
  description?: string;
}

export async function GET(): Promise<NextResponse> {
  await connectDb();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDb();

  const body = (await req.json()) as CategoryBody;

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { message: "name болон slug шаардлагатай" },
      { status: 400 }
    );
  }

  const exists = await Category.findOne({ slug: body.slug.trim().toLowerCase() });

  if (exists) {
    return NextResponse.json({ message: "slug давхцаж байна" }, { status: 400 });
  }

  const category = await Category.create({
    name: body.name,
    slug: body.slug.trim().toLowerCase(),
    description: body.description || "",
  });

  return NextResponse.json(category, { status: 201 });
}
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

interface CategoryBody {
  name: string;
  slug: string;
  description?: string;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { id } = await context.params;
  const body = (await req.json()) as CategoryBody;

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { message: "name болон slug шаардлагатай" },
      { status: 400 }
    );
  }

  const duplicate = await Category.findOne({
    slug: body.slug.trim().toLowerCase(),
    _id: { $ne: id },
  });

  if (duplicate) {
    return NextResponse.json({ message: "slug давхцаж байна" }, { status: 400 });
  }

  const updated = await Category.findByIdAndUpdate(
    id,
    {
      name: body.name,
      slug: body.slug.trim().toLowerCase(),
      description: body.description || "",
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { id } = await context.params;
  const used = await Product.findOne({ categoryId: id });

  if (used) {
    return NextResponse.json(
      { message: "Энэ ангилал дээр бараа байгаа тул устгах боломжгүй" },
      { status: 400 }
    );
  }

  await Category.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
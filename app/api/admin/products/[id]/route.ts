import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

interface ProductBody {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { id } = await context.params;
  const body = (await req.json()) as ProductBody;

  const duplicate = await Product.findOne({
    slug: body.slug.trim().toLowerCase(),
    _id: { $ne: id },
  });

  if (duplicate) {
    return NextResponse.json({ message: "slug давхцаж байна" }, { status: 400 });
  }

  const category = await Category.findById(body.categoryId);

  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 400 });
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name: body.name,
      slug: body.slug.trim().toLowerCase(),
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: body.imageUrl,
      categoryId: body.categoryId,
      isActive: body.isActive,
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
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ ok: true });
}
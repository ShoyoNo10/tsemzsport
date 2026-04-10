import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

interface ProductSizeBody {
  size: string;
  stock: number;
}

interface ProductBody {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  sizeVariants: ProductSizeBody[];
  isActive: boolean;
}

function normalizeSizeVariants(
  sizeVariants: ProductSizeBody[] | undefined
): ProductSizeBody[] {
  if (!Array.isArray(sizeVariants)) {
    return [];
  }

  const normalized = sizeVariants
    .map((item) => ({
      size: String(item.size || "").trim().toUpperCase(),
      stock: Number(item.stock),
    }))
    .filter(
      (item) =>
        item.size.length > 0 &&
        Number.isInteger(item.stock) &&
        item.stock >= 0
    );

  const uniqueMap = new Map<string, number>();

  for (const item of normalized) {
    uniqueMap.set(item.size, item.stock);
  }

  return Array.from(uniqueMap.entries()).map(([size, stock]) => ({
    size,
    stock,
  }));
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { id } = await context.params;
  const body = (await req.json()) as ProductBody;
  const normalizedSizes = normalizeSizeVariants(body.sizeVariants);

  if (
    !body.name ||
    !body.slug ||
    !body.description ||
    !body.imageUrl ||
    !body.categoryId ||
    Number(body.price) < 0 ||
    normalizedSizes.length === 0
  ) {
    return NextResponse.json(
      { message: "Барааны мэдээллээ бүрэн зөв оруулна уу" },
      { status: 400 }
    );
  }

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
      imageUrl: body.imageUrl,
      categoryId: body.categoryId,
      sizeVariants: normalizedSizes,
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
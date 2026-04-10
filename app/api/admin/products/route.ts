import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

interface ProductLeanSize {
  size: string;
  stock: number;
}

interface ProductLean {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: mongoose.Types.ObjectId;
  sizeVariants: ProductLeanSize[];
  isActive: boolean;
}

interface CategoryLean {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
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

function getTotalStock(sizeVariants: ProductLeanSize[]): number {
  return sizeVariants.reduce((sum, item) => sum + item.stock, 0);
}

export async function GET(): Promise<NextResponse> {
  await connectDb();

  const products = (await Product.find().sort({ createdAt: -1 }).lean()) as ProductLean[];
  const categories = (await Category.find().lean()) as CategoryLean[];

  const mapped = products.map((product) => {
    const category = categories.find(
      (item) => item._id.toString() === product.categoryId.toString()
    );

    return {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: getTotalStock(product.sizeVariants),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId.toString(),
      categoryName: category?.name || "",
      categorySlug: category?.slug || "",
      sizeVariants: product.sizeVariants.map((item) => ({
        size: item.size,
        stock: item.stock,
      })),
      isActive: product.isActive,
    };
  });

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDb();

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
  });

  if (duplicate) {
    return NextResponse.json({ message: "slug давхцаж байна" }, { status: 400 });
  }

  const category = await Category.findById(body.categoryId);

  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 400 });
  }

  const product = await Product.create({
    name: body.name,
    slug: body.slug.trim().toLowerCase(),
    description: body.description,
    price: Number(body.price),
    imageUrl: body.imageUrl,
    categoryId: body.categoryId,
    sizeVariants: normalizedSizes,
    isActive: body.isActive,
  });

  return NextResponse.json(product, { status: 201 });
}
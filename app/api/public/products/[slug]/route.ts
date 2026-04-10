import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

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

function getTotalStock(sizeVariants: ProductLeanSize[]): number {
  return sizeVariants.reduce((sum, item) => sum + item.stock, 0);
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  await connectDb();

  const { slug } = await context.params;

  const product = (await Product.findOne({ slug, isActive: true }).lean()) as
    | ProductLean
    | null;

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const category = (await Category.findById(product.categoryId).lean()) as
    | CategoryLean
    | null;

  return NextResponse.json({
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
  });
}
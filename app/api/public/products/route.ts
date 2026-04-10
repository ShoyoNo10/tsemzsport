import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectDb();

  const searchParams = req.nextUrl.searchParams;
  const q = (searchParams.get("q") || "").trim();
  const categorySlug = (searchParams.get("category") || "").trim();

  let categoryFilter: mongoose.Types.ObjectId | null = null;

  if (categorySlug) {
    const category = (await Category.findOne({ slug: categorySlug }).lean()) as
      | CategoryLean
      | null;

    if (!category) {
      return NextResponse.json([]);
    }

    categoryFilter = category._id;
  }

  const query: {
    isActive: boolean;
    categoryId?: mongoose.Types.ObjectId;
    $or?: Array<{
      name?: { $regex: string; $options: string };
      description?: { $regex: string; $options: string };
    }>;
  } = {
    isActive: true,
  };

  if (categoryFilter) {
    query.categoryId = categoryFilter;
  }

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const products = (await Product.find(query).sort({ createdAt: -1 }).lean()) as ProductLean[];
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
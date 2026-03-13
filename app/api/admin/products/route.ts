import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

interface ProductLean {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: mongoose.Types.ObjectId;
  isActive: boolean;
}

interface CategoryLean {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
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
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId.toString(),
      categoryName: category?.name || "",
      categorySlug: category?.slug || "",
      isActive: product.isActive,
    };
  });

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDb();

  const body = (await req.json()) as ProductBody;

  if (
    !body.name ||
    !body.slug ||
    !body.description ||
    !body.imageUrl ||
    !body.categoryId ||
    Number(body.price) < 0 ||
    Number(body.stock) < 0
  ) {
    return NextResponse.json(
      { message: "Барааны мэдээллээ бүрэн оруулна уу" },
      { status: 400 }
    );
  }

  const duplicate = await Product.findOne({ slug: body.slug.trim().toLowerCase() });

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
    stock: Number(body.stock),
    imageUrl: body.imageUrl,
    categoryId: body.categoryId,
    isActive: body.isActive,
  });

  return NextResponse.json(product, { status: 201 });
}
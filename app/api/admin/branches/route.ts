import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createBranchSchema } from "@/lib/validations";
import { BranchModel } from "@/models/Branch";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const branches = await BranchModel.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json(
    branches.map((item) => ({
      _id: String(item._id),
      name: item.name,
      address: item.address,
      imageUrl: item.imageUrl,
      description: item.description ?? "",
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const json: unknown = await request.json();
  const parsed = createBranchSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await BranchModel.create(parsed.data);

  return NextResponse.json({
    _id: String(created._id),
    name: created.name,
    address: created.address,
    imageUrl: created.imageUrl,
    description: created.description ?? "",
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
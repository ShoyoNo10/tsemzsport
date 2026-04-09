import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createBranchSchema } from "@/lib/validations";
import { BranchModel } from "@/models/Branch";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const { id } = await context.params;

  const json: unknown = await request.json();
  const parsed = createBranchSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await BranchModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "Салбар олдсонгүй" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    _id: String(updated._id),
    name: updated.name,
    address: updated.address,
    imageUrl: updated.imageUrl,
    description: updated.description ?? "",
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const { id } = await context.params;

  const deleted = await BranchModel.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Салбар олдсонгүй" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Салбар амжилттай устгагдлаа",
  });
}
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createClassOptionSchema } from "@/lib/validations";
import { BranchModel } from "@/models/Branch";
import { ClassOptionModel } from "@/models/ClassOption";
import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const classOptions = await ClassOptionModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    classOptions.map((item) => ({
      _id: String(item._id),
      title: item.title,
      ageRangeLabel: item.ageRangeLabel,
      price: item.price,
      branchId: String(item.branchId),
      scheduleTemplateId: String(item.scheduleTemplateId),
      description: item.description,
      isOpen: item.isOpen,
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
  const parsed = createClassOptionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const branchExists = await BranchModel.exists({ _id: parsed.data.branchId });
  const scheduleExists = await ScheduleTemplateModel.exists({
    _id: parsed.data.scheduleTemplateId,
  });

  if (!branchExists) {
    return NextResponse.json(
      { message: "Сонгосон салбар олдсонгүй" },
      { status: 404 }
    );
  }

  if (!scheduleExists) {
    return NextResponse.json(
      { message: "Сонгосон хуваарь олдсонгүй" },
      { status: 404 }
    );
  }

  const created = await ClassOptionModel.create(parsed.data);

  return NextResponse.json({
    _id: String(created._id),
    title: created.title,
    ageRangeLabel: created.ageRangeLabel,
    price: created.price,
    branchId: String(created.branchId),
    scheduleTemplateId: String(created.scheduleTemplateId),
    description: created.description,
    isOpen: created.isOpen,
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const json = (await request.json()) as {
    id?: string;
    title?: string;
    ageRangeLabel?: string;
    price?: number;
    branchId?: string;
    scheduleTemplateId?: string;
    description?: string;
    isOpen?: boolean;
    status?: "active" | "inactive";
  };

  if (!json.id) {
    return NextResponse.json({ message: "ID шаардлагатай" }, { status: 400 });
  }

  if (!Types.ObjectId.isValid(json.id)) {
    return NextResponse.json({ message: "ID буруу байна" }, { status: 400 });
  }

  const parsed = createClassOptionSchema.safeParse({
    title: json.title,
    ageRangeLabel: json.ageRangeLabel,
    price: json.price,
    branchId: json.branchId,
    scheduleTemplateId: json.scheduleTemplateId,
    description: json.description,
    isOpen: json.isOpen,
    status: json.status,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const branchExists = await BranchModel.exists({ _id: parsed.data.branchId });
  const scheduleExists = await ScheduleTemplateModel.exists({
    _id: parsed.data.scheduleTemplateId,
  });

  if (!branchExists) {
    return NextResponse.json(
      { message: "Сонгосон салбар олдсонгүй" },
      { status: 404 }
    );
  }

  if (!scheduleExists) {
    return NextResponse.json(
      { message: "Сонгосон хуваарь олдсонгүй" },
      { status: 404 }
    );
  }

  const updated = await ClassOptionModel.findByIdAndUpdate(json.id, parsed.data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "Анги олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json({
    _id: String(updated._id),
    title: updated.title,
    ageRangeLabel: updated.ageRangeLabel,
    price: updated.price,
    branchId: String(updated.branchId),
    scheduleTemplateId: String(updated.scheduleTemplateId),
    description: updated.description,
    isOpen: updated.isOpen,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const json = (await request.json()) as { id?: string };

  if (!json.id) {
    return NextResponse.json({ message: "ID шаардлагатай" }, { status: 400 });
  }

  if (!Types.ObjectId.isValid(json.id)) {
    return NextResponse.json({ message: "ID буруу байна" }, { status: 400 });
  }

  const deleted = await ClassOptionModel.findByIdAndDelete(json.id);

  if (!deleted) {
    return NextResponse.json({ message: "Анги олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json({ message: "Анги амжилттай устлаа" });
}
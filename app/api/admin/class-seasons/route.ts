import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createClassSeasonSchema } from "@/lib/validations";
import { ClassOptionModel } from "@/models/ClassOption";
import { ClassSeasonModel } from "@/models/ClassSeason";
import { RegistrationModel } from "@/models/Registration";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const [classSeasons, paidRegistrations] = await Promise.all([
    ClassSeasonModel.find().sort({ createdAt: -1 }).lean(),
    RegistrationModel.find({
      paymentStatus: "paid",
      status: "paid",
    })
      .select("classSeasonId")
      .lean(),
  ]);

  const paidCountBySeasonId = new Map<string, number>();

  for (const registration of paidRegistrations) {
    const classSeasonId = String(registration.classSeasonId);
    const currentCount = paidCountBySeasonId.get(classSeasonId) ?? 0;
    paidCountBySeasonId.set(classSeasonId, currentCount + 1);
  }

  return NextResponse.json(
    classSeasons.map((item) => {
      const enrolledCount = paidCountBySeasonId.get(String(item._id)) ?? 0;
      const remainingSeats = Math.max(item.capacity - enrolledCount, 0);
      const isFull = !item.isOpen || remainingSeats <= 0;

      return {
        _id: String(item._id),
        classOptionId: String(item.classOptionId),
        seasonLabel: item.seasonLabel,
        capacity: item.capacity,
        enrolledCount,
        remainingSeats,
        isFull,
        isOpen: item.isOpen,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    })
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const json: unknown = await request.json();
  const parsed = createClassSeasonSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const classExists = await ClassOptionModel.exists({
    _id: parsed.data.classOptionId,
  });

  if (!classExists) {
    return NextResponse.json(
      { message: "Сонгосон анги олдсонгүй" },
      { status: 404 }
    );
  }

  const created = await ClassSeasonModel.create(parsed.data);

  return NextResponse.json({
    _id: String(created._id),
    classOptionId: String(created.classOptionId),
    seasonLabel: created.seasonLabel,
    capacity: created.capacity,
    enrolledCount: 0,
    remainingSeats: created.capacity,
    isFull: !created.isOpen || created.capacity <= 0,
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
    classOptionId?: string;
    seasonLabel?: string;
    capacity?: number;
    isOpen?: boolean;
    status?: "active" | "inactive";
  };

  if (!json.id) {
    return NextResponse.json({ message: "ID шаардлагатай" }, { status: 400 });
  }

  if (!Types.ObjectId.isValid(json.id)) {
    return NextResponse.json({ message: "ID буруу байна" }, { status: 400 });
  }

  const parsed = createClassSeasonSchema.safeParse({
    classOptionId: json.classOptionId,
    seasonLabel: json.seasonLabel,
    capacity: json.capacity,
    isOpen: json.isOpen,
    status: json.status,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const classExists = await ClassOptionModel.exists({
    _id: parsed.data.classOptionId,
  });

  if (!classExists) {
    return NextResponse.json(
      { message: "Сонгосон анги олдсонгүй" },
      { status: 404 }
    );
  }

  const updated = await ClassSeasonModel.findByIdAndUpdate(json.id, parsed.data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "Сар / улирал олдсонгүй" },
      { status: 404 }
    );
  }

  const paidRegistrations = await RegistrationModel.find({
    paymentStatus: "paid",
    status: "paid",
    classSeasonId: updated._id,
  })
    .select("_id")
    .lean();

  const enrolledCount = paidRegistrations.length;
  const remainingSeats = Math.max(updated.capacity - enrolledCount, 0);
  const isFull = !updated.isOpen || remainingSeats <= 0;

  return NextResponse.json({
    _id: String(updated._id),
    classOptionId: String(updated.classOptionId),
    seasonLabel: updated.seasonLabel,
    capacity: updated.capacity,
    enrolledCount,
    remainingSeats,
    isFull,
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

  const deleted = await ClassSeasonModel.findByIdAndDelete(json.id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Сар / улирал олдсонгүй" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Сар болон суудал амжилттай устлаа" });
}
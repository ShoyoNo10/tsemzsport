import { NextRequest, NextResponse } from "next/server";
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
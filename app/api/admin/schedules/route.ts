import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createScheduleTemplateSchema } from "@/lib/validations";
import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const schedules = await ScheduleTemplateModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    schedules.map((item) => ({
      _id: String(item._id),
      title: item.title,
      slots: item.slots,
      sessionsPerWeek: item.sessionsPerWeek,
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
  const parsed = createScheduleTemplateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await ScheduleTemplateModel.create(parsed.data);

  return NextResponse.json({
    _id: String(created._id),
    title: created.title,
    slots: created.slots,
    sessionsPerWeek: created.sessionsPerWeek,
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
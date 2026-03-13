import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { BranchModel } from "@/models/Branch";
import { ClassOptionModel } from "@/models/ClassOption";
import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

export async function GET(): Promise<NextResponse> {
  await connectDb();

  const [branches, schedules, classOptions] = await Promise.all([
    BranchModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
    ScheduleTemplateModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
    ClassOptionModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
  ]);

  return NextResponse.json({
    branches: branches.map((item) => ({
      _id: String(item._id),
      name: item.name,
      address: item.address,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    schedules: schedules.map((item) => ({
      _id: String(item._id),
      title: item.title,
      slots: item.slots,
      sessionsPerWeek: item.sessionsPerWeek,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    classOptions: classOptions.map((item) => ({
      _id: String(item._id),
      title: item.title,
      ageRangeLabel: item.ageRangeLabel,
      price: item.price,
      branchId: String(item.branchId),
      scheduleTemplateId: String(item.scheduleTemplateId),
      description: item.description,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  });
}
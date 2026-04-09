// import { NextResponse } from "next/server";
// import { connectDb } from "@/lib/db";
// import { BranchModel } from "@/models/Branch";
// import { ClassOptionModel } from "@/models/ClassOption";
// import { RegistrationModel } from "@/models/Registration";
// import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

// export async function GET(): Promise<NextResponse> {
//   await connectDb();

//   const [branches, schedules, classOptions, paidRegistrations] = await Promise.all([
//     BranchModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
//     ScheduleTemplateModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
//     ClassOptionModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
//     RegistrationModel.find({
//       paymentStatus: "paid",
//       status: "paid",
//     })
//       .select("classOptionId")
//       .lean(),
//   ]);

//   const paidCountByClassOptionId = new Map<string, number>();

//   for (const registration of paidRegistrations) {
//     const classOptionId = String(registration.classOptionId);
//     const currentCount = paidCountByClassOptionId.get(classOptionId) ?? 0;
//     paidCountByClassOptionId.set(classOptionId, currentCount + 1);
//   }

//   return NextResponse.json({
//     branches: branches.map((item) => ({
//       _id: String(item._id),
//       name: item.name,
//       address: item.address,
//       imageUrl: item.imageUrl,
//       description: item.description ?? "",
//       status: item.status,
//       createdAt: item.createdAt.toISOString(),
//       updatedAt: item.updatedAt.toISOString(),
//     })),
//     schedules: schedules.map((item) => ({
//       _id: String(item._id),
//       title: item.title,
//       slots: item.slots,
//       sessionsPerWeek: item.sessionsPerWeek,
//       status: item.status,
//       createdAt: item.createdAt.toISOString(),
//       updatedAt: item.updatedAt.toISOString(),
//     })),
//     classOptions: classOptions.map((item) => {
//       const enrolledCount = paidCountByClassOptionId.get(String(item._id)) ?? 0;
//       const remainingSeats = Math.max(item.capacity - enrolledCount, 0);
//       const isFull = !item.isOpen || remainingSeats <= 0;

//       return {
//         _id: String(item._id),
//         title: item.title,
//         ageRangeLabel: item.ageRangeLabel,
//         seasonLabel: item.seasonLabel,
//         price: item.price,
//         branchId: String(item.branchId),
//         scheduleTemplateId: String(item.scheduleTemplateId),
//         description: item.description,
//         capacity: item.capacity,
//         isOpen: item.isOpen,
//         enrolledCount,
//         remainingSeats,
//         isFull,
//         status: item.status,
//         createdAt: item.createdAt.toISOString(),
//         updatedAt: item.updatedAt.toISOString(),
//       };
//     }),
//   });
// }


import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { BranchModel } from "@/models/Branch";
import { ClassOptionModel } from "@/models/ClassOption";
import { ClassSeasonModel } from "@/models/ClassSeason";
import { RegistrationModel } from "@/models/Registration";
import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

export async function GET(): Promise<NextResponse> {
  await connectDb();

  const [branches, schedules, classOptions, classSeasons, paidRegistrations] =
    await Promise.all([
      BranchModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
      ScheduleTemplateModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
      ClassOptionModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
      ClassSeasonModel.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
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

  return NextResponse.json({
    branches: branches.map((item) => ({
      _id: String(item._id),
      name: item.name,
      address: item.address,
      imageUrl: item.imageUrl,
      description: item.description ?? "",
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
      isOpen: item.isOpen,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    classSeasons: classSeasons.map((item) => {
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
    }),
  });
}
// import { NextRequest, NextResponse } from "next/server";
// import { connectDb } from "@/lib/db";
// import { env } from "@/lib/env";
// import { createClassOptionSchema } from "@/lib/validations";
// import { BranchModel } from "@/models/Branch";
// import { ClassOptionModel } from "@/models/ClassOption";
// import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

// export async function GET(request: NextRequest): Promise<NextResponse> {
//   const adminSecret = request.headers.get("x-admin-secret");

//   if (adminSecret !== env.ADMIN_SECRET) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await connectDb();

//   const classOptions = await ClassOptionModel.find()
//     .sort({ createdAt: -1 })
//     .lean();

//   return NextResponse.json(
//     classOptions.map((item) => ({
//       _id: String(item._id),
//       title: item.title,
//       ageRangeLabel: item.ageRangeLabel,
//       price: item.price,
//       branchId: String(item.branchId),
//       scheduleTemplateId: String(item.scheduleTemplateId),
//       description: item.description,
//       status: item.status,
//       createdAt: item.createdAt.toISOString(),
//       updatedAt: item.updatedAt.toISOString(),
//     })),
//   );
// }

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   const adminSecret = request.headers.get("x-admin-secret");

//   if (adminSecret !== env.ADMIN_SECRET) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await connectDb();

//   const json: unknown = await request.json();
//   const parsed = createClassOptionSchema.safeParse(json);

//   if (!parsed.success) {
//     return NextResponse.json(
//       { message: "Invalid data", errors: parsed.error.flatten() },
//       { status: 400 },
//     );
//   }

//   const branchExists = await BranchModel.exists({ _id: parsed.data.branchId });
//   const scheduleExists = await ScheduleTemplateModel.exists({
//     _id: parsed.data.scheduleTemplateId,
//   });

//   if (!branchExists) {
//     return NextResponse.json(
//       { message: "Сонгосон салбар олдсонгүй" },
//       { status: 404 },
//     );
//   }

//   if (!scheduleExists) {
//     return NextResponse.json(
//       { message: "Сонгосон хуваарь олдсонгүй" },
//       { status: 404 },
//     );
//   }

//   const created = await ClassOptionModel.create(parsed.data);

//   return NextResponse.json({
//     _id: String(created._id),
//     title: created.title,
//     ageRangeLabel: created.ageRangeLabel,
//     price: created.price,
//     branchId: String(created.branchId),
//     scheduleTemplateId: String(created.scheduleTemplateId),
//     description: created.description,
//     status: created.status,
//     createdAt: created.createdAt.toISOString(),
//     updatedAt: created.updatedAt.toISOString(),
//   });
// }






import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { createClassOptionSchema } from "@/lib/validations";
import { BranchModel } from "@/models/Branch";
import { ClassOptionModel } from "@/models/ClassOption";
import { RegistrationModel } from "@/models/Registration";
import { ScheduleTemplateModel } from "@/models/ScheduleTemplate";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const [classOptions, paidRegistrations] = await Promise.all([
    ClassOptionModel.find().sort({ createdAt: -1 }).lean(),
    RegistrationModel.find({
      paymentStatus: "paid",
      status: "paid",
    })
      .select("classOptionId")
      .lean(),
  ]);

  const paidCountByClassOptionId = new Map<string, number>();

  for (const registration of paidRegistrations) {
    const classOptionId = String(registration.classOptionId);
    const currentCount = paidCountByClassOptionId.get(classOptionId) ?? 0;
    paidCountByClassOptionId.set(classOptionId, currentCount + 1);
  }

  return NextResponse.json(
    classOptions.map((item) => {
      const enrolledCount = paidCountByClassOptionId.get(String(item._id)) ?? 0;
      const remainingSeats = Math.max(item.capacity - enrolledCount, 0);
      const isFull = !item.isOpen || remainingSeats <= 0;

      return {
        _id: String(item._id),
        title: item.title,
        ageRangeLabel: item.ageRangeLabel,
        price: item.price,
        branchId: String(item.branchId),
        scheduleTemplateId: String(item.scheduleTemplateId),
        description: item.description,
        capacity: item.capacity,
        isOpen: item.isOpen,
        enrolledCount,
        remainingSeats,
        isFull,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    }),
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
      { status: 400 },
    );
  }

  const branchExists = await BranchModel.exists({ _id: parsed.data.branchId });
  const scheduleExists = await ScheduleTemplateModel.exists({
    _id: parsed.data.scheduleTemplateId,
  });

  if (!branchExists) {
    return NextResponse.json(
      { message: "Сонгосон салбар олдсонгүй" },
      { status: 404 },
    );
  }

  if (!scheduleExists) {
    return NextResponse.json(
      { message: "Сонгосон хуваарь олдсонгүй" },
      { status: 404 },
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
    capacity: created.capacity,
    isOpen: created.isOpen,
    enrolledCount: 0,
    remainingSeats: created.capacity,
    isFull: !created.isOpen || created.capacity <= 0,
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
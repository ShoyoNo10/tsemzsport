import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { buildQPayDeepLink } from "@/lib/qpay";
import { createRegistrationSchema } from "@/lib/validations";
import { ClassOptionModel } from "@/models/ClassOption";
import { RegistrationModel } from "@/models/Registration";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await connectDb();

  const json: unknown = await request.json();
  const parsed = createRegistrationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Мэдээлэл буруу байна",
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const classOption = await ClassOptionModel.findById(data.classOptionId).lean();

  if (!classOption || classOption.status !== "active") {
    return NextResponse.json(
      { message: "Сонгосон анги олдсонгүй" },
      { status: 404 }
    );
  }

  const created = await RegistrationModel.create({
    lastName: data.lastName,
    firstName: data.firstName,
    registerNumber: data.registerNumber,
    phonePrimary: data.phonePrimary,
    phoneEmergency: data.phoneEmergency,
    homeAddress: data.homeAddress,
    classOptionId: classOption._id,
    branchId: classOption.branchId,
    scheduleTemplateId: classOption.scheduleTemplateId,
    status: "payment_pending",
    paymentStatus: "pending",
    qpayDeepLink: "",
  });

  const qpayDeepLink = buildQPayDeepLink({
    registrationId: String(created._id),
    amount: classOption.price,
    classTitle: classOption.title,
  });

  created.qpayDeepLink = qpayDeepLink;
  await created.save();

  return NextResponse.json({
    message: "Бүртгэл амжилттай үүслээ",
    registration: {
      _id: String(created._id),
      status: created.status,
      paymentStatus: created.paymentStatus,
      qpayDeepLink: created.qpayDeepLink,
    },
  });
}
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { RegistrationModel } from "@/models/Registration";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const registrations = await RegistrationModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    registrations.map((item) => ({
      _id: String(item._id),
      lastName: item.lastName,
      firstName: item.firstName,
      registerNumber: item.registerNumber,
      phonePrimary: item.phonePrimary,
      phoneEmergency: item.phoneEmergency,
      homeAddress: item.homeAddress,
      classOptionId: String(item.classOptionId),
      classSeasonId: String(item.classSeasonId),
      branchId: String(item.branchId),
      scheduleTemplateId: String(item.scheduleTemplateId),
      status: item.status,
      paymentStatus: item.paymentStatus,
      qpayInvoiceId: item.qpayInvoiceId,
      qpayPaymentId: item.qpayPaymentId,
      qpayQrText: item.qpayQrText,
      qpayQrImage: item.qpayQrImage,
      qpayPaymentUrl: item.qpayPaymentUrl,
      qpayDeepLink: item.qpayDeepLink,
      qpayShortUrl: item.qpayShortUrl,
      qpayUrls: item.qpayUrls,
      paidAt: item.paidAt ? item.paidAt.toISOString() : undefined,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  );
}
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { RegistrationModel } from "@/models/Registration";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    await connectDb();

    const { id } = await context.params;

    const registration = await RegistrationModel.findById(id).lean();

    if (!registration) {
      return NextResponse.json(
        { message: "Бүртгэл олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      registration: {
        _id: String(registration._id),
        lastName: registration.lastName,
        firstName: registration.firstName,
        registerNumber: registration.registerNumber,
        phonePrimary: registration.phonePrimary,
        phoneEmergency: registration.phoneEmergency,
        homeAddress: registration.homeAddress,
        classOptionId: String(registration.classOptionId),
        branchId: String(registration.branchId),
        scheduleTemplateId: String(registration.scheduleTemplateId),
        status: registration.status,
        paymentStatus: registration.paymentStatus,
        qpayInvoiceId: registration.qpayInvoiceId,
        qpayPaymentId: registration.qpayPaymentId,
        qpayQrText: registration.qpayQrText,
        qpayQrImage: registration.qpayQrImage,
        qpayPaymentUrl: registration.qpayPaymentUrl,
        qpayDeepLink: registration.qpayDeepLink,
        qpayShortUrl: registration.qpayShortUrl,
        qpayUrls: registration.qpayUrls,
        paidAt: registration.paidAt
          ? registration.paidAt.toISOString()
          : undefined,
        createdAt: registration.createdAt.toISOString(),
        updatedAt: registration.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        message: "Бүртгэл унших үед алдаа гарлаа",
        error: message,
      },
      { status: 500 }
    );
  }
}
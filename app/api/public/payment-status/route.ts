import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { checkQPayPayment } from "@/lib/qpay";
import { RegistrationModel } from "@/models/Registration";
import { getPaidDeleteAt } from "@/lib/registration-time";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const registrationId = request.nextUrl.searchParams.get("registrationId");

    if (!registrationId) {
      return NextResponse.json(
        { message: "registrationId шаардлагатай" },
        { status: 400 }
      );
    }

    const registration = await RegistrationModel.findById(registrationId);

    if (!registration) {
      return NextResponse.json(
        { message: "Бүртгэл олдсонгүй" },
        { status: 404 }
      );
    }

    if (!registration.qpayInvoiceId) {
      return NextResponse.json(
        { message: "QPay invoice олдсонгүй" },
        { status: 400 }
      );
    }

    const paymentCheck = await checkQPayPayment(registration.qpayInvoiceId);

    const paidRow = paymentCheck.rows.find((item) => {
      const statusValue =
        typeof item.payment_status === "string"
          ? item.payment_status.toLowerCase()
          : "";

      return statusValue === "paid" || statusValue === "success";
    });

if (paidRow) {
  registration.paymentStatus = "paid";
  registration.status = "paid";
  registration.qpayPaymentId =
    typeof paidRow.payment_id === "string" ? paidRow.payment_id : "";
  registration.paidAt = new Date();
  registration.deleteAt = getPaidDeleteAt();

  await registration.save();
}

    return NextResponse.json({
      registration: {
        _id: String(registration._id),
        status: registration.status,
        paymentStatus: registration.paymentStatus,
        qpayInvoiceId: registration.qpayInvoiceId,
        qpayPaymentUrl: registration.qpayPaymentUrl,
        qpayQrImage: registration.qpayQrImage,
        qpayQrText: registration.qpayQrText,
        qpayUrls: registration.qpayUrls,
      },
      payment: paymentCheck,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        message: "Төлбөр шалгах үед алдаа гарлаа",
        error: message,
      },
      { status: 500 }
    );
  }
}
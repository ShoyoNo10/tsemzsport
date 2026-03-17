import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { checkQPayPayment } from "@/lib/qpay";
import { RegistrationModel } from "@/models/Registration";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const qpayPaymentId = request.nextUrl.searchParams.get("payment_id")
      ?? request.nextUrl.searchParams.get("qpay_payment_id");

    if (!qpayPaymentId) {
      return new NextResponse("SUCCESS", { status: 200 });
    }

    const registrations = await RegistrationModel.find({
      qpayInvoiceId: { $ne: "" },
      paymentStatus: { $ne: "paid" },
    });

    for (const registration of registrations) {
      const paymentCheck = await checkQPayPayment(registration.qpayInvoiceId);

      const paidRow = paymentCheck.rows.find((item) => {
        const rowPaymentId =
          typeof item.payment_id === "string" ? item.payment_id : "";

        const statusValue =
          typeof item.payment_status === "string"
            ? item.payment_status.toLowerCase()
            : "";

        return (
          rowPaymentId === qpayPaymentId &&
          (statusValue === "paid" || statusValue === "success")
        );
      });

      if (paidRow) {
        registration.paymentStatus = "paid";
        registration.status = "paid";
        registration.qpayPaymentId =
          typeof paidRow.payment_id === "string" ? paidRow.payment_id : "";
        registration.paidAt = new Date();
        await registration.save();
        break;
      }
    }

    return new NextResponse("SUCCESS", { status: 200 });
  } catch {
    return new NextResponse("SUCCESS", { status: 200 });
  }
}
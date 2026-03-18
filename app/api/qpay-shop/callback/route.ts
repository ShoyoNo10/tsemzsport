import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { checkQPayPayment } from "@/lib/qpay";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface OrderItemLean {
  productId: string;
  quantity: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const qpayPaymentId =
      request.nextUrl.searchParams.get("payment_id") ??
      request.nextUrl.searchParams.get("qpay_payment_id");

    if (!qpayPaymentId) {
      return new NextResponse("SUCCESS", { status: 200 });
    }

    const orders = await Order.find({
      qpayInvoiceId: { $ne: "" },
      status: { $ne: "paid" },
    });

    for (const order of orders) {
      const paymentCheck = await checkQPayPayment(order.qpayInvoiceId);

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

      if (!paidRow) {
        continue;
      }

      for (const item of order.items as OrderItemLean[]) {
        const product = await Product.findById(item.productId);

        if (!product) {
          continue;
        }

        if (typeof product.stock === "number" && product.stock >= item.quantity) {
          product.stock = product.stock - item.quantity;
          await product.save();
        }
      }

      order.status = "paid";
      order.qpayPaymentId =
        typeof paidRow.payment_id === "string" ? paidRow.payment_id : "";
      order.paidAt = new Date();

      await order.save();
      break;
    }

    return new NextResponse("SUCCESS", { status: 200 });
  } catch {
    return new NextResponse("SUCCESS", { status: 200 });
  }
}
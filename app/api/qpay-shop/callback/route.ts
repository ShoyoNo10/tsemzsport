// import { NextRequest, NextResponse } from "next/server";
// import { connectDb } from "@/lib/db";
// import { checkQPayPayment } from "@/lib/qpay";
// import Order from "@/models/Order";
// import Product from "@/models/Product";

// interface OrderItemLean {
//   productId: string;
//   quantity: number;
// }

// export async function GET(request: NextRequest): Promise<NextResponse> {
//   try {
//     await connectDb();

//     const qpayPaymentId =
//       request.nextUrl.searchParams.get("payment_id") ??
//       request.nextUrl.searchParams.get("qpay_payment_id");

//     if (!qpayPaymentId) {
//       return new NextResponse("SUCCESS", { status: 200 });
//     }

//     const orders = await Order.find({
//       qpayInvoiceId: { $ne: "" },
//       status: { $ne: "paid" },
//     });

//     for (const order of orders) {
//       const paymentCheck = await checkQPayPayment(order.qpayInvoiceId);

//       const paidRow = paymentCheck.rows.find((item) => {
//         const rowPaymentId =
//           typeof item.payment_id === "string" ? item.payment_id : "";

//         const statusValue =
//           typeof item.payment_status === "string"
//             ? item.payment_status.toLowerCase()
//             : "";

//         return (
//           rowPaymentId === qpayPaymentId &&
//           (statusValue === "paid" || statusValue === "success")
//         );
//       });

//       if (!paidRow) {
//         continue;
//       }

//       for (const item of order.items as OrderItemLean[]) {
//         const product = await Product.findById(item.productId);

//         if (!product) {
//           continue;
//         }

//         if (typeof product.stock === "number" && product.stock >= item.quantity) {
//           product.stock = product.stock - item.quantity;
//           await product.save();
//         }
//       }

//       order.status = "paid";
//       order.qpayPaymentId =
//         typeof paidRow.payment_id === "string" ? paidRow.payment_id : "";
//       order.paidAt = new Date();

//       await order.save();
//       break;
//     }

//     return new NextResponse("SUCCESS", { status: 200 });
//   } catch {
//     return new NextResponse("SUCCESS", { status: 200 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { checkQPayPayment } from "@/lib/qpay";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface OrderItemLean {
  productId: string;
  size: string;
  quantity: number;
}

interface ProductSizeVariant {
  size: string;
  stock: number;
}

interface ProductDocumentLike {
  sizeVariants?: ProductSizeVariant[];
  save: () => Promise<unknown>;
}

async function reduceOrderStock(orderItems: OrderItemLean[]): Promise<void> {
  for (const item of orderItems) {
    const product = (await Product.findById(item.productId)) as ProductDocumentLike | null;

    if (!product || !Array.isArray(product.sizeVariants)) {
      continue;
    }

    const sizeIndex = product.sizeVariants.findIndex(
      (variant) => variant.size === item.size
    );

    if (sizeIndex === -1) {
      continue;
    }

    const currentStock = product.sizeVariants[sizeIndex]?.stock ?? 0;

    if (currentStock < item.quantity) {
      continue;
    }

    product.sizeVariants[sizeIndex].stock = currentStock - item.quantity;
    await product.save();
  }
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

      if (order.status !== "paid") {
        await reduceOrderStock(order.items as OrderItemLean[]);
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
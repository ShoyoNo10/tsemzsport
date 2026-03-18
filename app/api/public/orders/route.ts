import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { createQPayInvoice, getBestPaymentLink } from "@/lib/qpay";
import { env } from "@/lib/env";

interface ProductLean {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: mongoose.Types.ObjectId;
  isActive: boolean;
}

interface CreateOrderBody {
  customerPhone: string;
  alternatePhone?: string;
  address: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const body = (await req.json()) as CreateOrderBody;

    if (
      !body.customerPhone ||
      !body.address ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { message: "Мэдээллээ бүрэн оруулна уу" },
        { status: 400 }
      );
    }

    const items = body.items.filter(
      (item) =>
        item.productId.trim().length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );

    if (items.length === 0) {
      return NextResponse.json({ message: "Сагс хоосон байна" }, { status: 400 });
    }

    const productIds = items.map(
      (item) => new mongoose.Types.ObjectId(item.productId)
    );

    const products = (await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).lean()) as ProductLean[];

    if (products.length !== items.length) {
      return NextResponse.json(
        { message: "Зарим бараа олдсонгүй" },
        { status: 400 }
      );
    }

    const orderItems = items.map((item) => {
      const product = products.find(
        (productItem) => productItem._id.toString() === item.productId
      );

      if (!product) {
        throw new Error("Product not found while building order");
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.name} барааны үлдэгдэл хүрэлцэхгүй байна`);
      }

      return {
        productId: product._id.toString(),
        productName: product.name,
        productSlug: product.slug,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const created = await Order.create({
      customerPhone: body.customerPhone,
      alternatePhone: body.alternatePhone || "",
      address: body.address,
      items: orderItems,
      totalAmount,
      status: "pending",

      qpayInvoiceId: "",
      qpayPaymentId: "",
      qpayQrText: "",
      qpayQrImage: "",
      qpayPaymentUrl: "",
      qpayDeepLink: "",
      qpayShortUrl: "",
      qpayUrls: [],
      paidAt: null,
    });

    const senderInvoiceNo = `SHOP-${String(created._id)}`;
    const invoiceDescription = `Online shop order ${String(created._id)}`;
    const callbackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/qpay-shop/callback`;

    const invoice = await createQPayInvoice({
      senderInvoiceNo,
      amount: totalAmount,
      invoiceDescription,
      callbackUrl,
      invoiceReceiverCode: body.customerPhone,
      receiverRegister: body.customerPhone,
      receiverName: "Online Shop Customer",
      receiverPhone: body.customerPhone,
    });

    const bestPaymentLink = getBestPaymentLink(invoice.urls);

    created.qpayInvoiceId = invoice.invoiceId;
    created.qpayQrText = invoice.qrText;
    created.qpayQrImage = invoice.qrImage;
    created.qpayShortUrl = invoice.qPayShortUrl;
    created.set(
      "qpayUrls",
      invoice.urls.map((item) => ({
        name: item.name,
        description: item.description,
        logo: item.logo,
        link: item.link,
      }))
    );
    created.qpayPaymentUrl = bestPaymentLink;
    created.qpayDeepLink = bestPaymentLink;

    await created.save();

    return NextResponse.json({
      message: "Захиалга амжилттай үүслээ",
      order: {
        _id: String(created._id),
        status: created.status,
        totalAmount: created.totalAmount,
        qpayInvoiceId: created.qpayInvoiceId,
        qpayQrText: created.qpayQrText,
        qpayQrImage: created.qpayQrImage,
        qpayPaymentUrl: created.qpayPaymentUrl,
        qpayDeepLink: created.qpayDeepLink,
        qpayShortUrl: created.qpayShortUrl,
        qpayUrls: created.qpayUrls,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Захиалга үүсгэх үед алдаа гарлаа";

    return NextResponse.json(
      {
        message: "Захиалга үүсгэх үед алдаа гарлаа",
        error: message,
      },
      { status: 500 }
    );
  }
}
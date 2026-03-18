import mongoose, { Model, Schema } from "mongoose";

interface OrderItemDocument {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface QPayOrderUrlDocument {
  name: string;
  description: string;
  logo: string;
  link: string;
}

interface OrderDocument {
  customerPhone: string;
  alternatePhone?: string;
  address: string;
  items: OrderItemDocument[];
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";

  qpayInvoiceId: string;
  qpayPaymentId: string;
  qpayQrText: string;
  qpayQrImage: string;
  qpayPaymentUrl: string;
  qpayDeepLink: string;
  qpayShortUrl: string;
  qpayUrls: QPayOrderUrlDocument[];
  paidAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItemDocument>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const QPayOrderUrlSchema = new Schema<QPayOrderUrlDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    qpayInvoiceId: {
      type: String,
      default: "",
      trim: true,
    },
    qpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },
    qpayQrText: {
      type: String,
      default: "",
      trim: true,
    },
    qpayQrImage: {
      type: String,
      default: "",
      trim: true,
    },
    qpayPaymentUrl: {
      type: String,
      default: "",
      trim: true,
    },
    qpayDeepLink: {
      type: String,
      default: "",
      trim: true,
    },
    qpayShortUrl: {
      type: String,
      default: "",
      trim: true,
    },
    qpayUrls: {
      type: [QPayOrderUrlSchema],
      default: [],
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
export type OrderStatus = "pending" | "paid" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface QPayOrderUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface Order {
  _id: string;
  customerPhone: string;
  alternatePhone?: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;

  qpayInvoiceId?: string;
  qpayPaymentId?: string;
  qpayQrText?: string;
  qpayQrImage?: string;
  qpayPaymentUrl?: string;
  qpayDeepLink?: string;
  qpayShortUrl?: string;
  qpayUrls?: QPayOrderUrl[];
  paidAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  customerPhone: string;
  alternatePhone?: string;
  address: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
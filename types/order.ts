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

export interface Order {
  _id: string;
  customerPhone: string;
  alternatePhone?: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentReference?: string;
  qpayDeepLink?: string;
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
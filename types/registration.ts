export type RegistrationStatus =
  | "draft"
  | "submitted"
  | "payment_pending"
  | "paid"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed";

export interface QPayUrlItem {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface RegistrationDto {
  _id: string;
  lastName: string;
  firstName: string;
  registerNumber: string;
  phonePrimary: string;
  phoneEmergency: string;
  homeAddress: string;
  classOptionId: string;
  branchId: string;
  scheduleTemplateId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  qpayInvoiceId: string;
  qpayPaymentId: string;
  qpayQrText: string;
  qpayQrImage: string;
  qpayPaymentUrl: string;
  qpayDeepLink: string;
  qpayShortUrl: string;
  qpayUrls: QPayUrlItem[];
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
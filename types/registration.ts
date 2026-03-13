export type RegistrationStatus =
  | "draft"
  | "submitted"
  | "payment_pending"
  | "paid"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed";

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
  qpayDeepLink: string;
  createdAt: string;
  updatedAt: string;
}
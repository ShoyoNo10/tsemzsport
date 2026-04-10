
export interface QPayUrlItem {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export type GenderType = "male" | "female"; 

export interface RegistrationDto {
  _id: string;
  lastName: string;
  firstName: string;
  registerNumber: string;
  age: number;
  gender: GenderType;
  phonePrimary: string;
  phoneEmergency: string;
  homeAddress: string;
  classOptionId: string;
  classSeasonId: string;
  branchId: string;
  scheduleTemplateId: string;
  status: string;
  paymentStatus: string;
  qpayInvoiceId?: string;
  qpayPaymentId?: string;
  qpayQrText?: string;
  qpayQrImage?: string;
  qpayPaymentUrl?: string;
  qpayDeepLink?: string;
  qpayShortUrl?: string;
  qpayUrls?: {
    name: string;
    description: string;
    logo: string;
    link: string;
  }[];
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
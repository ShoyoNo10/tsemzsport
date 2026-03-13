interface BuildQPayDeepLinkParams {
  registrationId: string;
  amount: number;
  classTitle: string;
}

export const buildQPayDeepLink = ({
  registrationId,
  amount,
  classTitle,
}: BuildQPayDeepLinkParams): string => {
  const invoiceCode = `REG-${registrationId}`;
  const description = encodeURIComponent(`${classTitle} сургалтын төлбөр`);
  const deeplink = `qpay://payment?invoice_code=${invoiceCode}&amount=${amount}&description=${description}`;

  return deeplink;
};




export interface QPayInvoiceResult {
  invoiceId: string;
  qpayDeepLink: string;
}

function createMockDeepLink(reference: string, amount: number): string {
  const encodedRef = encodeURIComponent(reference);
  return `https://qpay.mn/mock/pay?ref=${encodedRef}&amount=${amount}`;
}

export async function createShopQPayInvoice(params: {
  orderCode: string;
  amount: number;
  description: string;
}): Promise<QPayInvoiceResult> {
  const useMock =
    process.env.QPAY_USE_MOCK === "true" ||
    !process.env.QPAY_USERNAME ||
    !process.env.QPAY_PASSWORD;

  if (useMock) {
    return {
      invoiceId: `mock-${params.orderCode}`,
      qpayDeepLink: createMockDeepLink(params.orderCode, params.amount),
    };
  }

  return {
    invoiceId: `fallback-${params.orderCode}`,
    qpayDeepLink: createMockDeepLink(params.orderCode, params.amount),
  };
}
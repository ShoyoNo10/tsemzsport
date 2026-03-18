// import { env } from "./env";

// export interface QPayAuthResponse {
//   access_token: string;
//   token_type: string;
//   expires_in: number;
//   refresh_token?: string;
// }

// export interface QPayInvoiceCreateRequest {
//   senderInvoiceNo: string;
//   amount: number;
//   invoiceDescription: string;
//   callbackUrl: string;
//   invoiceReceiverCode: string;
//   receiverRegister: string;
//   receiverName: string;
//   receiverEmail?: string;
//   receiverPhone?: string;
// }

// export interface QPayUrl {
//   name: string;
//   description: string;
//   logo: string;
//   link: string;
// }

// export interface QPayInvoiceCreateResponse {
//   invoiceId: string;
//   qrText: string;
//   qrImage: string;
//   qPayShortUrl: string;
//   urls: QPayUrl[];
// }

// export interface QPayPaymentCheckResponse {
//   rows: QPayPaymentCheckRow[];
//   count?: number;
//   paidAmount?: number;
// }

// export interface QPayPaymentCheckRow {
//   payment_id?: string;
//   payment_status?: string;
//   payment_date?: string;
//   payment_amount?: number;
//   invoice_id?: string;
//   object_type?: string;
//   object_id?: string;
//   [key: string]: string | number | boolean | null | undefined;
// }

// interface QPayInvoiceApiResponse {
//   invoice_id?: string;
//   qr_text?: string;
//   qr_image?: string;
//   qPay_shortUrl?: string;
//   qpay_shortUrl?: string;
//   urls?: QPayUrl[];
// }

// interface QPayPaymentCheckApiResponse {
//   rows?: QPayPaymentCheckRow[];
//   count?: number;
//   paid_amount?: number;
// }

// const getBasicAuthHeader = (): string => {
//   const credentials = `${env.QPAY_USERNAME}:${env.QPAY_PASSWORD}`;
//   return `Basic ${Buffer.from(credentials).toString("base64")}`;
// };

// export const getQPayAccessToken = async (): Promise<string> => {
//   const response = await fetch(`${env.QPAY_BASE_URL}/auth/token`, {
//     method: "POST",
//     headers: {
//       Authorization: getBasicAuthHeader(),
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`QPay auth failed: ${response.status} ${errorText}`);
//   }

//   const data = (await response.json()) as QPayAuthResponse;

//   if (!data.access_token) {
//     throw new Error("QPay access token missing");
//   }

//   return data.access_token;
// };

// export const createQPayInvoice = async (
//   payload: QPayInvoiceCreateRequest
// ): Promise<QPayInvoiceCreateResponse> => {
//   const accessToken = await getQPayAccessToken();

//   const response = await fetch(`${env.QPAY_BASE_URL}/invoice`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       invoice_code: env.QPAY_INVOICE_CODE,
//       sender_invoice_no: payload.senderInvoiceNo,
//       invoice_receiver_code: payload.invoiceReceiverCode,
//       sender_branch_code: "BRANCH1",
//       invoice_description: payload.invoiceDescription,
//       amount: payload.amount,
//       callback_url: payload.callbackUrl,
//       allow_partial: false,
//       minimum_amount: null,
//       allow_exceed: false,
//       maximum_amount: null,
//       note: null,
//       invoice_receiver_data: {
//         register: payload.receiverRegister,
//         name: payload.receiverName,
//         email: payload.receiverEmail ?? "",
//         phone: payload.receiverPhone ?? "",
//       },
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`QPay invoice create failed: ${response.status} ${errorText}`);
//   }

//   const data = (await response.json()) as QPayInvoiceApiResponse;

//   if (!data.invoice_id || !data.qr_text || !data.qr_image) {
//     throw new Error("QPay invoice response is incomplete");
//   }

//   return {
//     invoiceId: data.invoice_id,
//     qrText: data.qr_text,
//     qrImage: data.qr_image,
//     qPayShortUrl: data.qPay_shortUrl ?? data.qpay_shortUrl ?? "",
//     urls: Array.isArray(data.urls) ? data.urls : [],
//   };
// };

// export const checkQPayPayment = async (
//   invoiceId: string
// ): Promise<QPayPaymentCheckResponse> => {
//   const accessToken = await getQPayAccessToken();

//   const response = await fetch(`${env.QPAY_BASE_URL}/payment/check`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       object_type: "INVOICE",
//       object_id: invoiceId,
//       offset: {
//         page_number: 1,
//         page_limit: 100,
//       },
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`QPay payment check failed: ${response.status} ${errorText}`);
//   }

//   const data = (await response.json()) as QPayPaymentCheckApiResponse;

//   return {
//     rows: Array.isArray(data.rows) ? data.rows : [],
//     count: data.count,
//     paidAmount: data.paid_amount,
//   };
// };

// export const getBestPaymentLink = (urls: QPayUrl[]): string => {
//   if (urls.length === 0) {
//     return "";
//   }

//   const qpayWallet = urls.find((item) =>
//     item.link.toLowerCase().startsWith("qpaywallet://")
//   );

//   if (qpayWallet) {
//     return qpayWallet.link;
//   }

//   const firstHttps = urls.find((item) => item.link.startsWith("https://"));
//   if (firstHttps) {
//     return firstHttps.link;
//   }

//   return urls[0].link;
// };








// export interface QPayInvoiceResult {
//   invoiceId: string;
//   qpayDeepLink: string;
// }

// function createMockDeepLink(reference: string, amount: number): string {
//   const encodedRef = encodeURIComponent(reference);
//   return `https://qpay.mn/mock/pay?ref=${encodedRef}&amount=${amount}`;
// }

// export async function createShopQPayInvoice(params: {
//   orderCode: string;
//   amount: number;
//   description: string;
// }): Promise<QPayInvoiceResult> {
//   const useMock =
//     process.env.QPAY_USE_MOCK === "true" ||
//     !process.env.QPAY_USERNAME ||
//     !process.env.QPAY_PASSWORD;

//   if (useMock) {
//     return {
//       invoiceId: `mock-${params.orderCode}`,
//       qpayDeepLink: createMockDeepLink(params.orderCode, params.amount),
//     };
//   }

//   return {
//     invoiceId: `fallback-${params.orderCode}`,
//     qpayDeepLink: createMockDeepLink(params.orderCode, params.amount),
//   };
// }




import { env } from "./env";

export interface QPayAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface QPayInvoiceCreateRequest {
  senderInvoiceNo: string;
  amount: number;
  invoiceDescription: string;
  callbackUrl: string;
  invoiceReceiverCode: string;
  receiverRegister: string;
  receiverName: string;
  receiverEmail?: string;
  receiverPhone?: string;
}

export interface QPayUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayInvoiceCreateResponse {
  invoiceId: string;
  qrText: string;
  qrImage: string;
  qPayShortUrl: string;
  urls: QPayUrl[];
}

export interface QPayPaymentCheckResponse {
  rows: QPayPaymentCheckRow[];
  count?: number;
  paidAmount?: number;
}

export interface QPayPaymentCheckRow {
  payment_id?: string;
  payment_status?: string;
  payment_date?: string;
  payment_amount?: number;
  invoice_id?: string;
  object_type?: string;
  object_id?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface QPayInvoiceApiResponse {
  invoice_id?: string;
  qr_text?: string;
  qr_image?: string;
  qPay_shortUrl?: string;
  qpay_shortUrl?: string;
  urls?: QPayUrl[];
}

interface QPayPaymentCheckApiResponse {
  rows?: QPayPaymentCheckRow[];
  count?: number;
  paid_amount?: number;
}

const getBasicAuthHeader = (): string => {
  const credentials = `${env.QPAY_USERNAME}:${env.QPAY_PASSWORD}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
};

export const getQPayAccessToken = async (): Promise<string> => {
  const response = await fetch(`${env.QPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`QPay auth failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as QPayAuthResponse;

  if (!data.access_token) {
    throw new Error("QPay access token missing");
  }

  return data.access_token;
};

export const createQPayInvoice = async (
  payload: QPayInvoiceCreateRequest
): Promise<QPayInvoiceCreateResponse> => {
  const accessToken = await getQPayAccessToken();

  const response = await fetch(`${env.QPAY_BASE_URL}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice_code: env.QPAY_INVOICE_CODE,
      sender_invoice_no: payload.senderInvoiceNo,
      invoice_receiver_code: payload.invoiceReceiverCode,
      sender_branch_code: "BRANCH1",
      invoice_description: payload.invoiceDescription,
      amount: payload.amount,
      callback_url: payload.callbackUrl,
      allow_partial: false,
      minimum_amount: null,
      allow_exceed: false,
      maximum_amount: null,
      note: null,
      invoice_receiver_data: {
        register: payload.receiverRegister,
        name: payload.receiverName,
        email: payload.receiverEmail ?? "",
        phone: payload.receiverPhone ?? "",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`QPay invoice create failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as QPayInvoiceApiResponse;

  if (!data.invoice_id || !data.qr_text || !data.qr_image) {
    throw new Error("QPay invoice response is incomplete");
  }

  return {
    invoiceId: data.invoice_id,
    qrText: data.qr_text,
    qrImage: data.qr_image,
    qPayShortUrl: data.qPay_shortUrl ?? data.qpay_shortUrl ?? "",
    urls: Array.isArray(data.urls) ? data.urls : [],
  };
};

export const checkQPayPayment = async (
  invoiceId: string
): Promise<QPayPaymentCheckResponse> => {
  const accessToken = await getQPayAccessToken();

  const response = await fetch(`${env.QPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`QPay payment check failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as QPayPaymentCheckApiResponse;

  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    count: data.count,
    paidAmount: data.paid_amount,
  };
};

export const getBestPaymentLink = (urls: QPayUrl[]): string => {
  if (urls.length === 0) {
    return "";
  }

  const firstHttps = urls.find((item) => item.link.startsWith("https://"));
  if (firstHttps) {
    return firstHttps.link;
  }

  const qpayWallet = urls.find((item) =>
    item.link.toLowerCase().startsWith("qpaywallet://")
  );

  if (qpayWallet) {
    return qpayWallet.link;
  }

  return urls[0].link;
};
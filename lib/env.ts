const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

export const env = {
  MONGODB_URI: getEnv("MONGODB_URI"),
  ADMIN_SECRET: getEnv("ADMIN_SECRET"),
  NEXT_PUBLIC_SITE_NAME: getEnv("NEXT_PUBLIC_SITE_NAME"),
  QPAY_BASE_URL: getEnv("QPAY_BASE_URL"),
  QPAY_USERNAME: getEnv("QPAY_USERNAME"),
  QPAY_PASSWORD: getEnv("QPAY_PASSWORD"),
  QPAY_INVOICE_CODE: getEnv("QPAY_INVOICE_CODE"),
  QPAY_CALLBACK_URL: getEnv("QPAY_CALLBACK_URL"),
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL"),
};
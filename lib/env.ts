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
};
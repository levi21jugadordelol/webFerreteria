export const env = {
  JWT_SECRET: import.meta.env.JWT_SECRET as string,

  API_URL: import.meta.env.PUBLIC_API_URL as string,

  UPLOADS_URL: import.meta.env.PUBLIC_UPLOADS_URL as string,
};

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido");
}

if (!env.API_URL) {
  throw new Error("PUBLIC_API_URL no está definido");
}

if (!env.UPLOADS_URL) {
  throw new Error("PUBLIC_UPLOADS_URL no está definido");
}

export const env = {
  API_URL: import.meta.env.PUBLIC_API_URL as string,
  UPLOADS_URL: import.meta.env.PUBLIC_UPLOADS_URL as string,
};

if (!env.API_URL) {
  throw new Error("PUBLIC_API_URL no está definido");
}

if (!env.UPLOADS_URL) {
  throw new Error("PUBLIC_UPLOADS_URL no está definido");
}

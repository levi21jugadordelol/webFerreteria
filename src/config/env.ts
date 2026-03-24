export const env = {
  JWT_SECRET: import.meta.env.PUBLIC_JWT_SECRET as string,
};

if (!env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno");
}

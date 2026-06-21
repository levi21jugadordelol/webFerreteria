export const API_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const BACKEND_URL =
  import.meta.env.PUBLIC_BACKEND_URL || "http://localhost:3000";

export const UPLOADS_URL =
  import.meta.env.PUBLIC_UPLOADS_URL || `${BACKEND_URL}/uploads`;

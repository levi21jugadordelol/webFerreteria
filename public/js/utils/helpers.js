export const getApiUrl = () => {
  if (typeof window !== "undefined" && window.API_URL) {
    return `${window.API_URL}/api/v1`;
  }

  return "http://localhost:3000/api/v1";
};

export const safeJson = async (res) => {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("💣 ERROR PARSEANDO JSON");
    console.error("👉 URL:", res.url);
    console.error("👉 STATUS:", res.status);
    console.error("👉 RESPUESTA:", text);

    throw new Error("Respuesta no es JSON");
  }
};

export const getImageUrl = (apiUrl, img) => {
  const value = String(img || "").trim();

  if (!value) {
    return "https://via.placeholder.com/150";
  }

  if (value.includes("..")) {
    return "https://via.placeholder.com/150";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, "");
  const cleanApiUrl = String(apiUrl || "").replace(/\/+$/, "");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  return `${cleanApiUrl}/uploads/${encodeURIComponent(cleanPath)}`;
};

export const escapeHTML = (str = "") => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

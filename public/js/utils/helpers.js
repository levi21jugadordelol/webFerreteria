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
  const rawValue = String(img || "").trim();

  if (!rawValue) {
    return "/img/no-image.png";
  }

  if (rawValue.includes("..")) {
    return "/img/no-image.png";
  }

  let value = rawValue;

  try {
    const decoded = decodeURIComponent(rawValue);

    if (/^https?:\/\//i.test(decoded)) {
      value = decoded;
    }
  } catch {
    value = rawValue;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, "");
  const cleanApiUrl = String(apiUrl || "").replace(/\/+$/, "");

  if (!cleanPath) {
    return "/img/no-image.png";
  }

  return `${cleanApiUrl}/uploads/${cleanPath}`;
};

export const escapeHTML = (str = "") => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

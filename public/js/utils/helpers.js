export const getApiUrl = () => window.API_URL || "http://localhost:3000";

export const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const getImageUrl = (apiUrl, img) =>
  img ? `${apiUrl}/uploads/${img}` : "https://via.placeholder.com/150";

export const escapeHTML = (str = "") => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

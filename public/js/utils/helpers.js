export const getApiUrl = () => window.API_URL;

export const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const getImageUrl = (apiUrl, img) =>
  img ? `${apiUrl}/uploads/${img}` : "https://via.placeholder.com/150";

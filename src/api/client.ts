const API_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1";

function isJSON(res: Response) {
  return (res.headers.get("content-type") || "").includes("application/json");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL}${cleanPath}`;

  console.log("➡️ API REQUEST:", {
    url,
    method: options.method || "GET",
  });

  let response: Response;

  try {
    response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    console.error("❌ NETWORK ERROR:", { url, error });
    throw new Error("Error de conexión con el backend");
  }

  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();

  if (!contentType.includes("application/json")) {
    console.error("💣 LA API NO DEVOLVIÓ JSON", {
      url,
      status: response.status,
      contentType,
      body: raw.substring(0, 300),
    });

    throw new Error(`La API devolvió HTML o texto en vez de JSON: ${url}`);
  }

  let data;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("❌ JSON INVÁLIDO:", { url, raw });
    throw new Error("Respuesta JSON inválida del backend");
  }

  console.log("⬅️ API RESPONSE:", {
    url,
    status: response.status,
    ok: response.ok,
    data,
  });

  if (!response.ok) {
    throw new Error(data?.message || data?.msg || `Error ${response.status}`);
  }

  return data?.data ?? data;
}

export async function loginRequest({
  correo,
  password,
}: {
  correo: string;
  password: string;
}) {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error en login");
  }

  return data;
}

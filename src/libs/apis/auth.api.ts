// libs/api/auth.api.ts

const API_URL = ""; // 🔥 IMPORTANTE: usar proxy de Astro

/* =========================
   TIPOS
========================= */
type LoginData = {
  correo: string;
  password: string;
};

type RegisterData = {
  nombre: string;
  correo: string;
  password: string;
};

type AuthResponse = {
  msg: string;
};

type Admin = {
  id: number;
  nombre: string;
  rol: string;
};

type SessionResponse = {
  ok: boolean;
  admin: Admin;
};

/* =========================
   LOGIN
========================= */
export async function loginRequest({
  correo,
  password,
}: LoginData): Promise<AuthResponse> {
  const response = await fetch(`/auth/login`, {
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

/* =========================
   REGISTRO
========================= */
export async function registerRequest({
  nombre,
  correo,
  password,
}: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, password }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error en registro");
  }

  return data;
}

/* =========================
   VALIDAR SESIÓN
========================= */
export async function validarSesion(): Promise<SessionResponse | null> {
  const response = await fetch(`/auth/validar`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}

/* =========================
   LISTAR ADMINS
========================= */
export async function getAdminsRequest(): Promise<Admin[]> {
  const response = await fetch(`/auth/admins`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error al obtener admins");
  }

  return data;
}

/* =========================
   LOGOUT
========================= */
export async function logoutRequest(): Promise<AuthResponse> {
  const response = await fetch(`/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error al cerrar sesión");
  }

  return data;
}

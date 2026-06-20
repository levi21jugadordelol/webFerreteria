import { apiFetch } from "../../api/client";

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
export function loginRequest({
  correo,
  password,
}: LoginData): Promise<AuthResponse> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
}

/* =========================
   REGISTRO
========================= */
export function registerRequest({
  nombre,
  correo,
  password,
}: RegisterData): Promise<AuthResponse> {
  return apiFetch("/auth/registro", {
    method: "POST",
    body: JSON.stringify({ nombre, correo, password }),
  });
}

/* =========================
   VALIDAR SESIÓN
========================= */
export async function validarSesion(): Promise<SessionResponse | null> {
  try {
    return await apiFetch("/auth/validar");
  } catch {
    return null;
  }
}

/* =========================
   LISTAR ADMINS
========================= */
export function getAdminsRequest(): Promise<Admin[]> {
  return apiFetch("/auth/admins");
}

/* =========================
   LOGOUT
========================= */
export function logoutRequest(): Promise<AuthResponse> {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

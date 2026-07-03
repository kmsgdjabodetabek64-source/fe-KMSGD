import axiosAdmin from "../lib/axiosAdmin";
import type { LoginPayload, LoginResponse, Admin } from "../types/auth";

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axiosAdmin.post<LoginResponse>("/auth/login", payload);
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await axiosAdmin.post("/auth/logout");
}

export async function getMeRequest(): Promise<Admin> {
  const res = await axiosAdmin.get<{ admin: Admin }>("/auth/me");
  return res.data.admin;
}

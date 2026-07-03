import { create } from "zustand";
import type { Admin } from "../types/auth";
import { loginRequest, logoutRequest, getMeRequest } from "../service/authService";
import { setForceLogoutHandler } from "../lib/axiosAdmin";

interface AuthState {
  admin: Admin | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  status: "idle",
  error: null,

  login: async (username, password) => {
    set({ status: "loading", error: null });
    try {
      const res = await loginRequest({ username, password });
      set({ admin: res.admin, status: "authenticated", error: null });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Login gagal. Periksa kembali username dan password.";
      set({ status: "unauthenticated", error: message, admin: null });
      throw err;
    }
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      set({ admin: null, status: "unauthenticated", error: null });
    }
  },

  checkAuth: async () => {
    // ✅ Guard: kalau sudah loading/authenticated, jangan fetch ulang.
    // Ini mencegah StrictMode double-invoke atau multiple komponen
    // memicu request /auth/me lebih dari sekali secara bersamaan.
    const currentStatus = get().status;
    if (currentStatus === "loading" || currentStatus === "authenticated") {
      return;
    }

    set({ status: "loading" });
    try {
      const admin = await getMeRequest();
      set({ admin, status: "authenticated", error: null });
    } catch {
      set({ admin: null, status: "unauthenticated" });
    }
  },

  clearError: () => set({ error: null }),
}));

/**
 * Register forceLogout handler — menghubungkan axios interceptor
 * dengan auth store. Ketika refresh token gagal, interceptor
 * memanggil handler ini untuk reset state auth tanpa memanggil
 * API logout (karena semua token sudah invalid).
 */
setForceLogoutHandler(() => {
  useAuthStore.setState({
    admin: null,
    status: "unauthenticated",
    error: null,
  });
});

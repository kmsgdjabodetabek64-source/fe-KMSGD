import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import NotFoundPage from "../pages/NotFoundPage";

const SECRET_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

/**
 * GuestRoute — kebalikan dari ProtectedRoute.
 * Hanya bisa diakses oleh user yang BELUM login.
 *
 * Lapisan keamanan:
 * 1. Wajib ada ?access=SECRET_TOKEN di URL — tanpa token tampil 404
 * 2. Jika sudah login, redirect ke ?redirect= atau dashboard
 */
const GuestRoute = () => {
    const { status, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        if (status === "idle") {
            checkAuth();
        }
    }, [status, checkAuth]);

    // Validasi secret token — SEBELUM render apapun
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access");
    if (accessToken !== SECRET_ACCESS_TOKEN) {
        // Token salah / tidak ada → tampilkan 404, bukan redirect
        return <NotFoundPage />;
    }

    // Tunggu verifikasi token selesai
    if (status === "idle" || status === "loading") {
        return <div className="p-8 bg-[#141414] justify-center items-center text-center h-screen text-[#ffd700]">Memuat...</div>;
    }

    // Sudah login → redirect ke halaman asal (callback) atau dashboard
    if (status === "authenticated") {
        const redirectTo = params.get("redirect") || "/admin/dashboard";
        return <Navigate to={redirectTo} replace />;
    }

    // Belum login + token valid → tampilkan halaman login
    return <Outlet />;
};

export default GuestRoute;

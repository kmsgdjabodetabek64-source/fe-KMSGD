import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * SECRET_ACCESS_TOKEN — harus sama dengan yang ada di GuestRoute.
 * Digunakan saat redirect ke login agar admin tetap bisa masuk.
 */
const SECRET_ACCESS_TOKEN = "K5GD-4dm1n-P0rt4l";

/**
 * ProtectedRoute — hanya bisa diakses user yang sudah login.
 * Jika belum login, redirect ke halaman login dengan:
 *   - secret token agar GuestRoute tidak tampilkan 404
 *   - ?redirect= agar setelah login kembali ke halaman asal
 * Jika unauthenticated tanpa bisa di-redirect (edge case), tampilkan 404.
 */
const ProtectedRoute = () => {
    const { status, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        if (status === "idle") {
            checkAuth();
        }
    }, [status, checkAuth]);

    if (status === "idle" || status === "loading") {
        return <div className="p-8 text-center bg-[#141414] justify-center items-center h-screen text-[#ffd700]">Memuat...</div>;
    }

    if (status === "unauthenticated") {
        // Redirect ke login dengan secret token + callback URL
        const redirectParam = encodeURIComponent(location.pathname + location.search);
        return (
            <Navigate
                to={`/portal-kmsgd/auth?access=${SECRET_ACCESS_TOKEN}&redirect=${redirectParam}`}
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
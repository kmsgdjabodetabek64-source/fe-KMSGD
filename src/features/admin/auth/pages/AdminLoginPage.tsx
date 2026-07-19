import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import AdminLoginHeader from "../components/adminLogin/AdminLoginHeader";
import AdminLoginForm from "../components/adminLogin/AdminLoginForm";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, status, error: storeError, clearError } = useAuthStore();
    const [form, setForm] = useState({ username: "", password: "" });

    const loading = status === "loading";

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearError();
        try {
            await login(form.username, form.password);
            // Baca callback URL dari query param, fallback ke dashboard
            const params = new URLSearchParams(location.search);
            const redirectTo = params.get("redirect") || "/admin/dashboard";
            navigate(redirectTo, { replace: true });
        } catch {
            // error sudah ditangani di store
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <AdminLoginHeader />

                <AdminLoginForm
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    error={storeError}
                    onSubmit={handleSubmit}
                />

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}
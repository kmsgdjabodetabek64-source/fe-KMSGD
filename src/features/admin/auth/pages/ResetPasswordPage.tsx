import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosAdmin from "../../service/axiosAdmin";
import AdminLoginHeader from "../components/adminLogin/AdminLoginHeader";
import ResetPasswordCard from "../components/resetPassword/ResetPasswordCard";
import InvalidTokenState from "../components/resetPassword/InvalidTokenState";

const ACCESS = import.meta.env.VITE_ADMIN_ACCESS_TOKEN as string;
const LOGIN_URL = `/portal-kmsgd/auth?access=${ACCESS}`;

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [countdown, setCountdown] = useState(3);

    // Redirect otomatis ke login setelah berhasil
    useEffect(() => {
        if (status !== "success") return;
        if (countdown <= 0) {
            navigate(LOGIN_URL, { replace: true });
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [status, countdown, navigate]);

    // Guard: tidak ada token di URL
    if (!token) {
        return <InvalidTokenState />;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        if (form.password.length < 8) {
            setErrorMsg("Password minimal 8 karakter.");
            return;
        }
        if (form.password !== form.confirm) {
            setErrorMsg("Konfirmasi password tidak cocok.");
            return;
        }

        setStatus("loading");
        try {
            await axiosAdmin.post("/auth/reset-password", {
                token,
                password: form.password,
            });
            setStatus("success");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Gagal reset password. Coba lagi.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <AdminLoginHeader />

                <ResetPasswordCard
                    status={status}
                    errorMsg={errorMsg}
                    countdown={countdown}
                    loginUrl={LOGIN_URL}
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                />

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}
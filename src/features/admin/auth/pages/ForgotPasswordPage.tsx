import { useState } from "react";
import axiosAdmin from "../../service/axiosAdmin";
import AdminLoginHeader from "../components/adminLogin/AdminLoginHeader";
import ForgotPasswordCard from "../components/forgetPassword/ForgotPasswordCard";

const ACCESS = import.meta.env.VITE_ADMIN_ACCESS_TOKEN as string;
const LOGIN_URL = `/portal-kmsgd/auth?access=${ACCESS}`;

type Status = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordPage() {
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSend = async () => {
        setStatus("loading");
        setErrorMsg("");
        try {
            await axiosAdmin.post("/auth/forgot-password");
            setStatus("success");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Gagal mengirim email. Coba lagi.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <AdminLoginHeader />

                <ForgotPasswordCard
                    status={status}
                    errorMsg={errorMsg}
                    loginUrl={LOGIN_URL}
                    onSend={handleSend}
                />

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}
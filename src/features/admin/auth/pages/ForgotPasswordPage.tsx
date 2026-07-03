import { useState } from "react";
import { Link } from "react-router-dom";
import axiosAdmin from "../../service/axiosAdmin";

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
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Gagal mengirim email. Coba lagi.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 mb-4">
                        <img src="/logo.webp" alt="" />
                    </div>
                    <h1 className="text-white font-bold text-xl tracking-wide">
                        KELUARGA MAHASISWA <br /> SUNAN GUNUNG DJATI
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">
                        Admin Panel
                    </p>
                </div>

                <div className="border border-neutral-800 border-t-[3px] border-t-amber-500 bg-neutral-900 p-6">
                    <h2 className="text-white font-semibold text-sm mb-2 tracking-wide">
                        Lupa Password?
                    </h2>
                    <p className="text-neutral-500 text-xs mb-6 leading-relaxed">
                        Klik tombol di bawah untuk mengirim link reset password ke email admin.
                        Link berlaku selama <span className="text-neutral-300">15 menit</span>.
                    </p>

                    {/* Success state */}
                    {status === "success" ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-4 py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span>
                                    Link reset password telah dikirim ke email admin.
                                    Silakan cek inbox Anda.
                                </span>
                            </div>
                            <Link
                                to={LOGIN_URL}
                                className="text-center text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                            >
                                ← Kembali ke Login
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Error state */}
                            {status === "error" && (
                                <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                onClick={handleSend}
                                disabled={status === "loading"}
                                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-black text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                            >
                                {status === "loading" ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        Kirim Link Reset ke Email Admin
                                    </>
                                )}
                            </button>

                            <Link
                                to={LOGIN_URL}
                                className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                ← Kembali ke Login
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}

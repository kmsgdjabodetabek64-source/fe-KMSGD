import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axiosAdmin from "../../service/axiosAdmin";

const ACCESS = import.meta.env.VITE_ADMIN_ACCESS_TOKEN as string;
const LOGIN_URL = `/portal-kmsgd/auth?access=${ACCESS}`;

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center">
                    <div className="border border-red-900 bg-red-950 px-6 py-8 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <p className="text-red-300 text-sm font-semibold mb-1">Link Tidak Valid</p>
                        <p className="text-red-400 text-xs">Token reset tidak ditemukan dalam URL.</p>
                    </div>
                    <Link to="/portal-kmsgd/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                        Minta Link Baru
                    </Link>
                </div>
            </div>
        );
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
        } catch (err: any) {
            const msg =
                err?.response?.data?.message || "Gagal reset password. Coba lagi.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };

    const EyeIcon = ({ open }: { open: boolean }) =>
        open ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772M15.212 15.212a3.001 3.001 0 1 1-4.242-4.242M9.88 9.88l4.24 4.24" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        );

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
                        Buat Password Baru
                    </h2>
                    <p className="text-neutral-500 text-xs mb-5 leading-relaxed">
                        Masukkan password baru Anda. Minimal <span className="text-neutral-300">8 karakter</span>.
                    </p>

                    {/* Berhasil */}
                    {status === "success" ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-4 py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span>
                                    Password berhasil diubah! Semua sesi lama telah dinonaktifkan.
                                    Mengalihkan ke login dalam{" "}
                                    <strong className="text-emerald-200">{countdown}</strong> detik...
                                </span>
                            </div>
                            <Link
                                to={LOGIN_URL}
                                className="text-center text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                            >
                                Login Sekarang →
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Error */}
                            {errorMsg && (
                                <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    {errorMsg}
                                </div>
                            )}

                            {/* Password baru */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                                    Password Baru
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required
                                        minLength={8}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Minimal 8 karakter"
                                        className="w-full bg-neutral-950 border border-neutral-700 text-white text-sm pl-3 pr-10 py-2.5 outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <EyeIcon open={showPass} />
                                    </button>
                                </div>
                            </div>

                            {/* Konfirmasi password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                                    Konfirmasi Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        required
                                        value={form.confirm}
                                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                        placeholder="Ulangi password baru"
                                        className={`w-full bg-neutral-950 border text-white text-sm pl-3 pr-10 py-2.5 outline-none transition-colors placeholder:text-neutral-600 ${
                                            form.confirm && form.confirm !== form.password
                                                ? "border-red-700 focus:border-red-500"
                                                : "border-neutral-700 focus:border-amber-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <EyeIcon open={showConfirm} />
                                    </button>
                                </div>
                                {form.confirm && form.confirm !== form.password && (
                                    <p className="text-[10px] text-red-400 mt-0.5">Password tidak cocok</p>
                                )}
                            </div>

                            {/* Kekuatan password */}
                            {form.password && (
                                <div className="flex gap-1">
                                    {[
                                        form.password.length >= 8,
                                        /[A-Z]/.test(form.password),
                                        /[0-9]/.test(form.password),
                                        /[^A-Za-z0-9]/.test(form.password),
                                    ].map((met, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 transition-colors ${
                                                met ? "bg-amber-500" : "bg-neutral-700"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="mt-1 w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-black text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                            >
                                {status === "loading" ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                        Simpan Password Baru
                                    </>
                                )}
                            </button>

                            <Link
                                to={LOGIN_URL}
                                className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                ← Kembali ke Login
                            </Link>
                        </form>
                    )}
                </div>

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}

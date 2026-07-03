import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, status, error: storeError, clearError } = useAuthStore();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

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
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 mb-4">
                        <img src="/logo.webp" alt="" />
                    </div>
                    <h1 className="text-white font-bold text-xl tracking-wide">KELUARGA MAHASISWA <br /> SUNAN GUNUNG DJATI</h1>
                    <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">Admin Panel</p>
                </div>

                <div className="border border-neutral-800 border-t-[3px] border-t-amber-500 bg-neutral-900 p-6">
                    <h2 className="text-white font-semibold text-sm mb-5 tracking-wide">Masuk ke Dashboard</h2>

                    {storeError && (
                        <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5 mb-4">
                            <i className="ti ti-alert-circle text-sm" />
                            {storeError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                                username
                            </label>
                            <input
                                type="text"
                                required
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="masukan username"
                                className="bg-neutral-950 border border-neutral-700 text-white text-sm px-3 py-2.5 outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-950 border border-neutral-700 text-white text-sm pl-3 pr-10 py-2.5 outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772M15.212 15.212a3.001 3.001 0 1 1-4.242-4.242M9.88 9.88l4.24 4.24" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-black text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="ti ti-loader-2 animate-spin text-sm" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <i className="ti ti-login text-sm" />
                                    Masuk
                                </>
                            )}
                        </button>

                        <div className="text-center pt-1">
                            <Link
                                to="/portal-kmsgd/forgot-password"
                                className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors"
                            >
                                Lupa Password?
                            </Link>
                        </div>
                    </form>
                </div>

                <p className="text-center text-neutral-600 text-[10px] mt-4">
                    © {new Date().getFullYear()} KMSGD — Hak akses terbatas
                </p>
            </div>
        </div>
    );
}
import { useState, useEffect, useRef } from "react";
import axiosPublic from "@/lib/axiosPublic";

type Status = "idle" | "loading" | "success" | "error";

export default function FormUser() {
    const [form, setForm] = useState({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
    });
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-dismiss success banner setelah 6 detik
    useEffect(() => {
        if (status === "success") {
            successTimerRef.current = setTimeout(() => {
                setStatus("idle");
            }, 6000);
        }
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
        };
    }, [status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (status === "loading") return;

        setStatus("loading");
        setErrorMsg("");

        try {
            await axiosPublic.post("/contact", {
                nama: form.nama.trim(),
                email: form.email.trim(),
                subjek: form.subjek.trim(),
                pesan: form.pesan.trim(),
            });

            setStatus("success");
            setForm({ nama: "", email: "", subjek: "", pesan: "" });
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Gagal mengirim pesan. Periksa koneksi dan coba lagi.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };

    return (
        <section className="lg:col-span-5 bg-[#20201f] border border-[#ffd700] p-8 sticky top-24 transform transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <h2 className="text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-6 flex items-center gap-2">
                Kirim Pesan
            </h2>
            <div className="flex flex-col gap-4">

                {/* ── Success Banner ───────────────────────────────────────── */}
                {status === "success" && (
                    <div className="flex items-start gap-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs px-4 py-3 animate-[fadeIn_0.3s_ease-out]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>
                            Pesan berhasil terkirim! Kami akan segera menghubungi Anda melalui email.
                        </span>
                    </div>
                )}

                {/* ── Error Banner ─────────────────────────────────────────── */}
                {status === "error" && (
                    <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                <div className="flex flex-col gap-2 group">
                    <label className="text-[#d0c6ab] text-xs font-semibold tracking-wide transition-colors group-focus-within:text-[#ffd700]">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        name="nama"
                        placeholder="Masukkan nama Anda"
                        value={form.nama}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className="bg-[#131313] border border-[#e5e2e1] text-[#e5e2e1] text-sm p-3 outline-none placeholder:text-[#4d4732] transition-all duration-300 ease-out hover:border-[#d0c6ab] focus:border-[#ffd700] focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#ffd700] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2 group">
                    <label className="text-[#d0c6ab] text-xs font-semibold tracking-wide transition-colors group-focus-within:text-[#ffd700]">
                        Alamat Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="contoh@email.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className="bg-[#131313] border border-[#e5e2e1] text-[#e5e2e1] text-sm p-3 outline-none placeholder:text-[#4d4732] transition-all duration-300 ease-out hover:border-[#d0c6ab] focus:border-[#ffd700] focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#ffd700] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2 group">
                    <label className="text-[#d0c6ab] text-xs font-semibold tracking-wide transition-colors group-focus-within:text-[#ffd700]">
                        Subjek
                    </label>
                    <input
                        type="text"
                        name="subjek"
                        placeholder="Tujuan pesan"
                        value={form.subjek}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className="bg-[#131313] border border-[#e5e2e1] text-[#e5e2e1] text-sm p-3 outline-none placeholder:text-[#4d4732] transition-all duration-300 ease-out hover:border-[#d0c6ab] focus:border-[#ffd700] focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#ffd700] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2 group">
                    <label className="text-[#d0c6ab] text-xs font-semibold tracking-wide transition-colors group-focus-within:text-[#ffd700]">
                        Pesan
                    </label>
                    <textarea
                        name="pesan"
                        placeholder="Tuliskan pesan Anda di sini..."
                        value={form.pesan}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        rows={5}
                        className="bg-[#131313] border border-[#e5e2e1] text-[#e5e2e1] text-sm p-3 outline-none resize-none placeholder:text-[#4d4732] transition-all duration-300 ease-out hover:border-[#d0c6ab] focus:border-[#ffd700] focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#ffd700] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="mt-4 bg-[#ffd700] text-[#131313] font-bold text-lg py-4 px-6 flex items-center justify-center gap-2 outline-none transition-all duration-300 ease-out hover:bg-[#e9c400] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#e5e2e1] active:translate-y-0 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {status === "loading" ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Mengirim...
                        </>
                    ) : (
                        <>
                            Kirim Pesan <span className="transition-transform duration-300 group-hover:translate-x-1">➤</span>
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
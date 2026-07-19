import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import AdminLoginErrorAlert from "./AdminLoginErrorAlert";

interface AdminLoginFormProps {
    form: { username: string; password: string };
    setForm: (form: { username: string; password: string }) => void;
    loading: boolean;
    error: string | null;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function AdminLoginForm({ form, setForm, loading, error, onSubmit }: AdminLoginFormProps) {
    return (
        <div className="border border-neutral-800 border-t-[3px] border-t-amber-500 bg-neutral-900 p-6">
            <h2 className="text-white font-semibold text-sm mb-5 tracking-wide">
                Masuk ke Dashboard
            </h2>

            {error && <AdminLoginErrorAlert message={error} />}

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                    <PasswordInput
                        value={form.password}
                        onChange={(password) => setForm({ ...form, password })}
                    />
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
    );
}
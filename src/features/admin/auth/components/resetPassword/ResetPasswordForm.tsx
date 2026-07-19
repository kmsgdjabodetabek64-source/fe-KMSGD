import { Link } from "react-router-dom";
import { TbLoader2, TbDeviceFloppy } from "react-icons/tb";
import ErrorAlert from "@/components/common/ErrorAlert";
import ResetPasswordField from "./ResetPasswordField";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

interface ResetPasswordFormProps {
    form: { password: string; confirm: string };
    setForm: (form: { password: string; confirm: string }) => void;
    loading: boolean;
    error: string | null;
    loginUrl: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ResetPasswordForm({
    form,
    setForm,
    loading,
    error,
    loginUrl,
    onSubmit,
}: ResetPasswordFormProps) {
    const confirmInvalid = Boolean(form.confirm && form.confirm !== form.password);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {error && <ErrorAlert message={error} />}

            <ResetPasswordField
                label="Password Baru"
                value={form.password}
                onChange={(password) => setForm({ ...form, password })}
                placeholder="Minimal 8 karakter"
                minLength={8}
            />

            <ResetPasswordField
                label="Konfirmasi Password"
                value={form.confirm}
                onChange={(confirm) => setForm({ ...form, confirm })}
                placeholder="Ulangi password baru"
                invalid={confirmInvalid}
                errorText="Password tidak cocok"
            />

            <PasswordStrengthMeter password={form.password} />

            <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-black text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <TbDeviceFloppy className="w-4 h-4" />
                        Simpan Password Baru
                    </>
                )}
            </button>

            <Link
                to={loginUrl}
                className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
            >
                ← Kembali ke Login
            </Link>
        </form>
    );
}
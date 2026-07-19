import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordSuccessState from "./ResetPasswordSuccessState";

type Status = "idle" | "loading" | "success" | "error";

interface ResetPasswordCardProps {
    status: Status;
    errorMsg: string;
    countdown: number;
    loginUrl: string;
    form: { password: string; confirm: string };
    setForm: (form: { password: string; confirm: string }) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ResetPasswordCard({
    status,
    errorMsg,
    countdown,
    loginUrl,
    form,
    setForm,
    onSubmit,
}: ResetPasswordCardProps) {
    return (
        <div className="border border-neutral-800 border-t-[3px] border-t-amber-500 bg-neutral-900 p-6">
            <h2 className="text-white font-semibold text-sm mb-2 tracking-wide">
                Buat Password Baru
            </h2>
            <p className="text-neutral-500 text-xs mb-5 leading-relaxed">
                Masukkan password baru Anda. Minimal <span className="text-neutral-300">8 karakter</span>.
            </p>

            {status === "success" ? (
                <ResetPasswordSuccessState countdown={countdown} loginUrl={loginUrl} />
            ) : (
                <ResetPasswordForm
                    form={form}
                    setForm={setForm}
                    loading={status === "loading"}
                    error={status === "error" ? errorMsg : null}
                    loginUrl={loginUrl}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    );
}
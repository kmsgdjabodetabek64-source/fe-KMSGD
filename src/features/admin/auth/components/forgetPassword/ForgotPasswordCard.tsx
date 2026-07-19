import ForgotPasswordIdleState from "./ForgotPasswordIdleState";
import ForgotPasswordSuccessState from "./ForgotPasswordSuccessState";

type Status = "idle" | "loading" | "success" | "error";

interface ForgotPasswordCardProps {
    status: Status;
    errorMsg: string;
    loginUrl: string;
    onSend: () => void;
}

export default function ForgotPasswordCard({ status, errorMsg, loginUrl, onSend }: ForgotPasswordCardProps) {
    return (
        <div className="border border-neutral-800 border-t-[3px] border-t-amber-500 bg-neutral-900 p-6">
            <h2 className="text-white font-semibold text-sm mb-2 tracking-wide">
                Lupa Password?
            </h2>
            <p className="text-neutral-500 text-xs mb-6 leading-relaxed">
                Klik tombol di bawah untuk mengirim link reset password ke email admin.
                Link berlaku selama <span className="text-neutral-300">15 menit</span>.
            </p>

            {status === "success" ? (
                <ForgotPasswordSuccessState loginUrl={loginUrl} />
            ) : (
                <ForgotPasswordIdleState
                    loading={status === "loading"}
                    error={status === "error" ? errorMsg : null}
                    loginUrl={loginUrl}
                    onSend={onSend}
                />
            )}
        </div>
    );
}
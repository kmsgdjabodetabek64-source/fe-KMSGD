import { Link } from "react-router-dom";
import { TbLoader2, TbMailForward } from "react-icons/tb";
import ErrorAlert from "@/components/common/ErrorAlert";

interface ForgotPasswordIdleStateProps {
    loading: boolean;
    error: string | null;
    loginUrl: string;
    onSend: () => void;
}

export default function ForgotPasswordIdleState({
    loading,
    error,
    loginUrl,
    onSend,
}: ForgotPasswordIdleStateProps) {
    return (
        <div className="flex flex-col gap-4">
            {error && <ErrorAlert message={error} />}

            <button
                onClick={onSend}
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-black text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                        Mengirim...
                    </>
                ) : (
                    <>
                        <TbMailForward className="w-4 h-4" />
                        Kirim Link Reset ke Email Admin
                    </>
                )}
            </button>

            <Link
                to={loginUrl}
                className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
            >
                ← Kembali ke Login
            </Link>
        </div>
    );
}
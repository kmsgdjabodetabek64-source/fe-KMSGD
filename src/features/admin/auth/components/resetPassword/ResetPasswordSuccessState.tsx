import { Link } from "react-router-dom";
import SuccessAlert from "@/components/common/SuccessAlert";

interface ResetPasswordSuccessStateProps {
    countdown: number;
    loginUrl: string;
}

export default function ResetPasswordSuccessState({ countdown, loginUrl }: ResetPasswordSuccessStateProps) {
    return (
        <div className="flex flex-col gap-4">
            <SuccessAlert>
                Password berhasil diubah! Semua sesi lama telah dinonaktifkan.
                Mengalihkan ke login dalam{" "}
                <strong className="text-emerald-200">{countdown}</strong> detik...
            </SuccessAlert>
            <Link
                to={loginUrl}
                className="text-center text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
            >
                Login Sekarang →
            </Link>
        </div>
    );
}
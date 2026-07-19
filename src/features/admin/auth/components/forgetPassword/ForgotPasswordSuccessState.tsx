import { Link } from "react-router-dom";
import SuccessAlert from "@/components/common/SuccessAlert";

interface ForgotPasswordSuccessStateProps {
    loginUrl: string;
}

export default function ForgotPasswordSuccessState({ loginUrl }: ForgotPasswordSuccessStateProps) {
    return (
        <div className="flex flex-col gap-4">
            <SuccessAlert>
                Link reset password telah dikirim ke email admin. Silakan cek inbox Anda.
            </SuccessAlert>
            <Link
                to={loginUrl}
                className="text-center text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
            >
                ← Kembali ke Login
            </Link>
        </div>
    );
}
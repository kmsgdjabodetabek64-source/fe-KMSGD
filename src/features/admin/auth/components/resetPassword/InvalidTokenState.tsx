import { Link } from "react-router-dom";
import { TbAlertTriangle } from "react-icons/tb";

export default function InvalidTokenState() {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                <div className="border border-red-900 bg-red-950 px-6 py-8 mb-4">
                    <TbAlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-red-300 text-sm font-semibold mb-1">Link Tidak Valid</p>
                    <p className="text-red-400 text-xs">Token reset tidak ditemukan dalam URL.</p>
                </div>
                <Link
                    to="/portal-kmsgd/forgot-password"
                    className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                >
                    Minta Link Baru
                </Link>
            </div>
        </div>
    );
}
import { User } from "lucide-react";

interface Props {
    jabatan: string;
    nama: string;
    image?: string | null;
    isKetua?: boolean;
    quote?: string | null;
}

export default function StrukturOrganisasiCard({ jabatan, nama, image, isKetua = false, quote }: Props) {
    if (isKetua) {
        return (
            <div className="w-full max-w-64 sm:max-w-72 bg-[#111] border border-[#ffd700] p-4 sm:p-5 text-center shadow-[0_0_20px_rgba(255,215,0,0.12)] hover:-translate-y-1 transition duration-300">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-linear-to-b from-[#3a3200] to-[#1a1a1a] flex items-center justify-center border border-[#ffd700]/40 mb-4 overflow-hidden">
                    {image
                        ? <img src={image} alt={nama} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        : <User className="text-[#ffd700]" size={34} />
                    }
                </div>
                <p className="text-[9px] sm:text-[10px] tracking-[2px] uppercase text-[#ffd700] mb-2 line-clamp-2">{jabatan}</p>
                <h3 className="text-white font-semibold text-sm sm:text-base leading-snug">{nama}</h3>
                {quote && <p className="text-gray-500 italic text-xs mt-3 line-clamp-2">"{quote}"</p>}
            </div>
        );
    }

    return (
        <div className="w-full bg-[#111] p-3 sm:p-5 text-center border border-[#1f1f1f] hover:border-[#ffd700]/40 hover:-translate-y-1 transition duration-300">
            <div className="w-full aspect-square max-w-32 sm:max-w-40 mx-auto bg-linear-to-b from-[#3a3200] to-[#1a1a1a] flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
                {image
                    ? <img src={image} alt={nama} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    : <User className="text-[#d4af37]" size={28} />
                }
            </div>
            <p className="text-[8px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] uppercase text-[#ffd700] mb-1.5 line-clamp-2">{jabatan}</p>
            <h3 className="text-white font-semibold text-xs sm:text-sm leading-snug line-clamp-2">{nama}</h3>
        </div>
    );
}

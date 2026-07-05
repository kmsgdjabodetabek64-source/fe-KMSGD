import { User } from "lucide-react";

type Variant = "ketua" | "wakil" | "anggota";

interface Props {
    jabatan: string;
    nama: string;
    image?: string | null;
    variant?: Variant;
    quote?: string | null;
}

const VARIANT_STYLES: Record<Variant, {
    wrapper: string;
    accentBar: string;
    badgeBorder: string;
    badgeText: string;
    nameSize: string;
    fallbackIcon: string;
}> = {
    ketua: {
        wrapper: "w-full max-w-64 sm:max-w-80",
        accentBar: "bg-gradient-to-r from-[#ffd700] via-[#c9e265] to-[#3ea34d]",
        badgeBorder: "border-[#ffd700]",
        badgeText: "text-[#ffd700]",
        nameSize: "text-lg sm:text-xl",
        fallbackIcon: "text-[#ffd700]",
    },
    wakil: {
        wrapper: "w-full max-w-64 sm:max-w-80",
        accentBar: "bg-gradient-to-r from-[#3ea34d] to-[#1f5c2c]",
        badgeBorder: "border-[#7ddc8c]",
        badgeText: "text-[#7ddc8c]",
        nameSize: "text-base sm:text-lg",
        fallbackIcon: "text-[#7ddc8c]",
    },
    anggota: {
        wrapper: "w-full max-w-64 sm:max-w-80",
        accentBar: "bg-[#2a2a2a]",
        badgeBorder: "border-[#d4af37]/50",
        badgeText: "text-[#d4af37]",
        nameSize: "text-xs sm:text-sm",
        fallbackIcon: "text-[#d4af37]",
    },
};

export default function StrukturOrganisasiCard({
    jabatan,
    nama,
    image,
    variant = "anggota",
    quote,
}: Props) {
    const s = VARIANT_STYLES[variant];
    const isPimpinan = variant === "ketua" || variant === "wakil";

    return (
        <div className={`${s.wrapper} mx-auto`}>
            <div
                className={`relative overflow-hidden aspect-3/4 bg-linear-to-b from-[#3a3200] to-[#1a1a1a] shadow-[0_0_20px_rgba(255,215,0,0.08)] hover:-translate-y-1 transition duration-300 group`}
            >
                {/* accent bar atas */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 z-20 ${s.accentBar}`} />

                {/* foto */}
                {image ? (
                    <img
                        src={image}
                        alt={nama}
                        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <User className={s.fallbackIcon} size={isPimpinan ? 44 : 30} />
                    </div>
                )}

                {/* overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* teks informasi */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-center">
                    <h3 className={`text-white font-semibold leading-snug mb-1 line-clamp-2 ${s.nameSize}`}>
                        {nama}
                    </h3>
                    <span
                        className={`inline-block px-2 py-0.5 border ${s.badgeBorder} ${s.badgeText} text-[9px] sm:text-[10px] tracking-[1.5px] uppercase font-medium`}
                    >
                        {jabatan}
                    </span>
                    {quote && (
                        <p className="text-gray-300/80 italic text-[10px] sm:text-[11px] mt-1.5 line-clamp-2">
                            &ldquo;{quote}&rdquo;
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
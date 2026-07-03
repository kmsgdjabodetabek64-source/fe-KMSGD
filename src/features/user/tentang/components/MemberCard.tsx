import { User } from "lucide-react";
import type { Member, MemberVariant } from "../types/tentang.types";

interface MemberCardProps {
    member: Member;
    variant?: MemberVariant;
    className?: string;
}

export default function MemberCard({
    member,
    variant = "anggota",
    className = "",
}: MemberCardProps) {

    if (variant === "ketua") {
        return (
            <div className={`inline-flex items-center gap-3 sm:gap-4 bg-[#151515] border border-[#ffd700]/20 px-3 sm:px-5 py-3 sm:py-4 ${className}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#222] shrink-0 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                        <img src={member.image} alt={member.nama} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                        <User className="text-[#ffd700]" size={24} />
                    )}
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-[#ffd700]">
                        {member.jabatan}
                    </p>
                    <h4 className="text-white font-semibold">
                        {member.nama}
                    </h4>
                </div>
            </div>
        );
    }

    if (variant === "demisioner") {
        return (
            <div className={`bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center gap-4 hover:border-[#ffd700]/30 transition ${className}`}>
                <div className="w-14 h-14 bg-[#202020] border border-[#333] shrink-0 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                        <img src={member.image} alt={member.nama} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <User size={16} className="text-[#ffd700]" />
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="text-[#f5f5f5] font-semibold text-sm truncate">
                        {member.nama}
                    </h4>
                    <p className="text-[#ffd700] text-[10px] uppercase tracking-[1.5px] mt-1 truncate">
                        {member.jabatan}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className={`bg-[#151515] border flex items-center border-[#1f1f1f] p-3 sm:p-5 hover:border-[#ffd700]/30 transition ${className}`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#222] shrink-0 flex items-center justify-center overflow-hidden">
                {member.image ? (
                    <img src={member.image} alt={member.nama} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                ) : (
                    <User className="text-gray-400" size={20} />
                )}
            </div>
            <div className="ml-3 sm:ml-5 min-w-0">
                <h4 className="text-white font-medium text-sm sm:text-base truncate">
                    {member.nama}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-[1px] truncate">
                    {member.jabatan}
                </p>
            </div>
        </section>
    );
}

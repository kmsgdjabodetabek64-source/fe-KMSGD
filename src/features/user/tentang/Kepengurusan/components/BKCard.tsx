import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import MemberCard from "../../components/MemberCard";
import type { Department } from "../../types/tentang.types";

interface Props {
    bk: Department;
    isOpen: boolean;
    onToggle: () => void;
}

export default function BKCard({ bk, isOpen, onToggle }: Props) {
    return (
        <section className="bg-[#111] border border-[#1f1f1f] overflow-hidden">

            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#151515] transition"
            >
                <div className="flex items-center gap-5">
                    <div
                        className={`w-14 h-14 flex items-center justify-center border transition-all ${isOpen ? "bg-[#ffd700] border-[#ffd700]" : "bg-[#1b1b1b] border-[#ffd700]/20"
                            }`}
                    >
                        <Shield size={22} className={isOpen ? "text-black" : "text-[#ffd700]"} />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg">{bk.nama}</h3>
                        <p className="text-gray-500 text-sm">{bk.desc}</p>
                        <p className="text-[#777] text-xs mt-1 uppercase tracking-[1px]">
                            {bk.staff.length + 2} Anggota
                        </p>
                    </div>
                </div>

                {isOpen ? (
                    <ChevronUp className="text-gray-500" />
                ) : (
                    <ChevronDown className="text-gray-500" />
                )}
            </button>

            {/* CONTENT */}
            <div
                className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-250 opacity-100 p-6 pt-0" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="mb-8 mt-8 flex flex-col md:flex-row gap-4">
                    <MemberCard member={bk.ketua} variant="ketua" />
                    <MemberCard member={bk.wakil} variant="ketua" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    {bk.staff.map((staff, idx) => (
                        <MemberCard key={idx} member={staff} variant="anggota" />
                    ))}
                </div>
            </div>
        </section>
    );
}

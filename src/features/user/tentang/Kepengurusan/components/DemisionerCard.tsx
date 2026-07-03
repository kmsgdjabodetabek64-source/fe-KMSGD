import { ChevronDown, GraduationCap } from "lucide-react";
import MemberCard from "../../components/MemberCard";

interface Member {
    jabatan: string;
    nama: string;
    image?: string | null;
}

interface Props {
    periode: string;
    namaDepartemen: string;
    anggota: Member[];
    isOpen: boolean;
    onToggle: () => void;
}

export default function DemisionerCard({ periode, namaDepartemen, anggota, isOpen, onToggle }: Props) {
    const ketua = anggota.find((a) => a.jabatan?.toLowerCase().includes("ketua") && !a.jabatan?.toLowerCase().includes("wakil")) || { nama: "-", jabatan: "Ketua Departemen" };
    const wakil = anggota.find((a) => a.jabatan?.toLowerCase().includes("wakil")) || { nama: "-", jabatan: "Wakil Ketua Departemen" };
    const staff = anggota.filter((a) => a !== ketua && a !== wakil);

    return (
        <section
            className={`bg-[#111] border transition-all duration-300 ${isOpen ? "border-[#2c2c2c]" : "border-[#1f1f1f] hover:border-[#2a2a2a]"
                }`}
        >
            {/* HEADER */}
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-6 text-left"
            >
                <div className="flex items-center gap-5">
                    <div
                        className={`w-14 h-14 flex items-center justify-center border transition-all ${isOpen ? "bg-[#ffd700] border-[#ffd700]" : "bg-[#151515] border-[#2a2a2a]"
                            }`}
                    >
                        <GraduationCap size={22} className={isOpen ? "text-black" : "text-[#ffd700]"} />
                    </div>
                    <div>
                        <h3
                            className={`text-xl font-bold font-['Montserrat'] ${isOpen ? "text-white" : "text-[#f5f5f5]"
                                }`}
                        >
                            {periode}
                        </h3>
                        <p className="text-[#777] text-sm mt-1">
                            {namaDepartemen} • {anggota.length} Anggota
                        </p>
                    </div>
                </div>

                <span
                    className={`text-[#777] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    <ChevronDown size={20} />
                </span>
            </button>

            {/* CONTENT */}
            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-500 opacity-100 px-6 pb-6" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="mb-8 mt-8 flex flex-col md:flex-row gap-4">
                    <MemberCard member={ketua} variant="ketua" />
                    <MemberCard member={wakil} variant="ketua" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    {staff.map((s, idx) => (
                        <MemberCard key={idx} member={s} variant="anggota" />
                    ))}
                </div>
            </div>
        </section>
    );
}
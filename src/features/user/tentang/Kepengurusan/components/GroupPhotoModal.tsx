import { X, User, Crown, Users } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ModalMember {
    nama: string;
    jabatan: string;
    image?: string | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    nama: string;
    img?: string | null;
    anggota: ModalMember[];
}

function isLeader(jabatan: string) {
    const j = jabatan.toLowerCase();
    return j.includes("ketua") || j.includes("wakil");
}

/** Bottom-sheet di mobile, centered dialog di desktop */
export default function GroupPhotoModal({ open, onClose, nama, img, anggota }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const leaders = anggota.filter(a => isLeader(a.jabatan));
    const staff   = anggota.filter(a => !isLeader(a.jabatan));

    return (
        <div
            ref={overlayRef}
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-[999] flex items-end sm:items-center justify-center
                transition-all duration-300
                ${open ? "bg-black/75 backdrop-blur-sm" : "bg-transparent pointer-events-none"}`}
            aria-modal="true"
            role="dialog"
            aria-label={nama}
        >
            {/* Panel */}
            <div className={`relative w-full sm:max-w-lg bg-[#0d0d0d] border border-[#2a2a2a]
                max-h-[92dvh] sm:max-h-[85dvh] flex flex-col
                transition-all duration-400 ease-out rounded-t-2xl sm:rounded-none
                ${open
                    ? "translate-y-0 opacity-100 sm:scale-100"
                    : "translate-y-full opacity-0 sm:scale-95 sm:translate-y-0"
                }`}
            >
                {/* Drag handle — mobile only */}
                <div className="sm:hidden w-10 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-1 shrink-0" />

                {/* Header */}
                <div className="relative shrink-0">
                    {img ? (
                        <div className="relative h-44 sm:h-52 overflow-hidden">
                            <img src={img} alt={`Foto ${nama}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                <p className="text-[#ffd700] text-[10px] uppercase tracking-[2px] mb-0.5">
                                    {anggota.length > 0 && leaders.length > 0 ? "Departemen / Badan Khusus" : "Grup"}
                                </p>
                                <h2 className="text-white font-bold text-lg sm:text-xl leading-tight">{nama}</h2>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Users size={11} className="text-[#ffd700]" />
                                    <span className="text-[#aaa] text-xs">{anggota.length} Anggota</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e]">
                            <h2 className="text-white font-bold text-lg">{nama}</h2>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Users size={11} className="text-[#ffd700]" />
                                <span className="text-[#aaa] text-xs">{anggota.length} Anggota</span>
                            </div>
                        </div>
                    )}

                    {/* Tombol tutup */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9
                            bg-black/60 backdrop-blur-sm border border-white/10
                            flex items-center justify-center hover:bg-black/80 transition-colors"
                        aria-label="Tutup"
                    >
                        <X size={15} className="text-white" />
                    </button>
                </div>

                {/* Daftar anggota — scrollable */}
                <div className="overflow-y-auto overscroll-contain flex-1 px-4 sm:px-5 py-4 space-y-4">
                    {leaders.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[#ffd700] text-[10px] uppercase tracking-[2px] flex items-center gap-1.5 mb-3">
                                <Crown size={10} /> Pimpinan
                            </p>
                            {leaders.map((m, i) => <MemberRow key={i} member={m} isLeader />)}
                        </div>
                    )}

                    {staff.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[#777] text-[10px] uppercase tracking-[2px] flex items-center gap-1.5 mb-3">
                                <Users size={10} /> Anggota
                            </p>
                            {staff.map((m, i) => <MemberRow key={i} member={m} />)}
                        </div>
                    )}

                    {anggota.length === 0 && (
                        <p className="text-center text-[#444] text-sm py-8">Belum ada data anggota.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function MemberRow({ member, isLeader = false }: { member: ModalMember; isLeader?: boolean }) {
    return (
        <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 border transition-colors
            ${isLeader
                ? "bg-[#ffd700]/5 border-[#ffd700]/15 hover:border-[#ffd700]/30"
                : "bg-[#111] border-[#1e1e1e] hover:border-[#2a2a2a]"
            }`}
        >
            <div className={`shrink-0 overflow-hidden flex items-center justify-center bg-[#1a1a1a]
                ${isLeader ? "w-12 h-12 sm:w-14 sm:h-14" : "w-10 h-10 sm:w-12 sm:h-12"}`}
            >
                {member.image
                    ? <img src={member.image} alt={member.nama} className="w-full h-full object-cover" loading="lazy" />
                    : <User size={isLeader ? 20 : 16} className={isLeader ? "text-[#ffd700]" : "text-[#444]"} />
                }
            </div>
            <div className="min-w-0 flex-1">
                <p className={`font-semibold truncate leading-tight ${isLeader ? "text-white text-sm sm:text-base" : "text-[#e0e0e0] text-sm"}`}>
                    {member.nama}
                </p>
                <p className={`text-[10px] sm:text-xs mt-0.5 uppercase tracking-[1.5px] truncate
                    ${isLeader ? "text-[#ffd700]" : "text-[#555]"}`}
                >
                    {member.jabatan}
                </p>
            </div>
            {isLeader && <Crown size={12} className="text-[#ffd700]/60 shrink-0" />}
        </div>
    );
}

import { useState } from "react";
import { Users, ImageOff } from "lucide-react";
import GroupPhotoModal, { type ModalMember } from "./GroupPhotoModal";

interface Props {
    nama: string;
    desc?: string;
    img?: string | null;
    anggota: ModalMember[];
}

/**
 * Card foto bersama reusable.
 * Dipakai di: DepartemenCard, BKCard, DepartemenSection (demisioner)
 *
 * Hover  → foto zoom scale-110
 * Klik   → modal bottom-sheet daftar anggota
 */
export default function GroupPhotoCard({ nama, desc, img, anggota }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <article
                onClick={() => setModalOpen(true)}
                className="group relative overflow-hidden bg-[#0d0d0d] border border-[#1e1e1e]
                    hover:border-[#ffd700]/40 transition-all duration-300
                    cursor-pointer active:scale-[0.97] touch-manipulation select-none"
            >
                {/* ── Foto bersama ── */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
                    {img ? (
                        <img
                            src={img}
                            alt={`Foto ${nama}`}
                            className="w-full h-full object-cover
                                transition-transform duration-500 ease-out
                                group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#111]">
                            <ImageOff size={24} className="text-[#333]" />
                            <span className="text-[#333] text-[10px] sm:text-xs">Belum ada foto</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Badge anggota */}
                    <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5
                        flex items-center gap-1 bg-black/70 backdrop-blur-sm
                        border border-[#ffd700]/20 px-1.5 py-0.5 sm:px-2 sm:py-1">
                        <Users size={9} className="text-[#ffd700]" />
                        <span className="text-[#ffd700] text-[9px] sm:text-xs font-semibold leading-none">
                            {anggota.length}
                        </span>
                    </div>

                    {/* Nama + deskripsi di atas gradient */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                        <h3 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-2 mb-0.5">
                            {nama}
                        </h3>
                        {desc && (
                            <p className="text-[#aaa] text-[10px] sm:text-xs leading-snug line-clamp-2 hidden sm:block">
                                {desc}
                            </p>
                        )}
                    </div>
                </div>

                {/* Accent bar bawah */}
                <div className="h-[2px] w-0 group-hover:w-full bg-[#ffd700] transition-all duration-300" />
            </article>

            <GroupPhotoModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                nama={nama}
                img={img}
                anggota={anggota}
            />
        </>
    );
}

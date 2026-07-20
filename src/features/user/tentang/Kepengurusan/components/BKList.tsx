import { useEffect, useState } from "react";
import { getBKAktif } from "../services/kepengurusan";
import type { Department } from "../../types/tentang.types";
import type { AnggotaBK } from "../types/kepengurusanTypes";
import BKCard from "./BKCard";
import ShowMoreButton from "../../../../../components/ShowMoreButton";
import { useShowMore } from "@/hooks/useShowMore";
import RevealItem from "@/components/RevealItem";

export default function BKList() {
    const [bkData, setBkData] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBKAktif()
            .then((data) => {
                const mapped: Department[] = data.map((bk) => {
                    const ketuaFallback: AnggotaBK = { id: -1, bkId: bk.id, nama: "-", jabatan: "Ketua" };
                    const wakilFallback: AnggotaBK = { id: -2, bkId: bk.id, nama: "-", jabatan: "Wakil Ketua" };
                    const ketua = bk.anggota.find((a) => a.jabatan?.toLowerCase().includes("ketua") && !a.jabatan?.toLowerCase().includes("wakil")) || ketuaFallback;
                    const wakil = bk.anggota.find((a) => a.jabatan?.toLowerCase().includes("wakil")) || wakilFallback;
                    const staff = bk.anggota.filter((a) => a.id !== ketua.id && a.id !== wakil.id);

                    return {
                        nama: bk.namaBK,
                        desc: bk.deskripsi || "",
                        img: bk.img ?? null,
                        ketua: { nama: ketua.nama, jabatan: ketua.jabatan, image: ketua.image },
                        wakil: { nama: wakil.nama, jabatan: wakil.jabatan, image: wakil.image },
                        staff: staff.map(s => ({ nama: s.nama, jabatan: s.jabatan, image: s.image })),
                    };
                });
                setBkData(mapped);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const { visibleItems, showAll, hasMore, toggle } = useShowMore(bkData, 6);

    return (
        <>
            {loading && (
                <div className="flex items-center justify-center gap-3 py-16">
                    <div className="w-5 h-5 border-2 border-[#ffd700]/40 border-t-[#ffd700] rounded-full animate-spin" />
                    <p className="text-[#ffd700]/50 text-sm">Memuat badan khusus...</p>
                </div>
            )}

            {!loading && bkData.length === 0 && (
                <p className="text-center text-neutral-400 py-10">Belum ada data badan khusus.</p>
            )}

            {!loading && bkData.length > 0 && (
                <>
                    <RevealItem animation="animate-fade-in">
                        <section className="pt-16 pb-4 border-t border-[#2a2a2a]">
                            {/* Grid 2 kolom — identik dengan DepartemenList */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                                {visibleItems.map((bk, index) => (
                                    <BKCard key={index} bk={bk} />
                                ))}
                            </div>
                        </section>
                    </RevealItem>

                    {hasMore && (
                        <ShowMoreButton showAll={showAll} onToggle={toggle} />
                    )}
                </>
            )}
        </>
    );
}

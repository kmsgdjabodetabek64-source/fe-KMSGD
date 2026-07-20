import { useEffect, useState } from "react";
import { getDepartemenAktif } from "../services/kepengurusan";
import type { Department } from "../../types/tentang.types";
import type { AnggotaDepartemen } from "../types/kepengurusanTypes";
import DepartemenCard from "./DepartemenCard";
import ShowMoreButton from "../../../../../components/ShowMoreButton";
import { useShowMore } from "@/hooks/useShowMore";
import RevealItem from "@/components/RevealItem";

export default function DepartemenList() {
    const [departemenData, setDepartemenData] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDepartemenAktif()
            .then((data) => {
                const mapped: Department[] = data.map((d) => {
                    const ketuaFallback: AnggotaDepartemen = { id: -1, departemenId: d.id, nama: "-", jabatan: "Ketua Departemen" };
                    const wakilFallback: AnggotaDepartemen = { id: -2, departemenId: d.id, nama: "-", jabatan: "Wakil Ketua Departemen" };
                    const ketua = d.anggota.find((a) => a.jabatan?.toLowerCase().includes("ketua") && !a.jabatan?.toLowerCase().includes("wakil")) || ketuaFallback;
                    const wakil = d.anggota.find((a) => a.jabatan?.toLowerCase().includes("wakil")) || wakilFallback;
                    const staff = d.anggota.filter((a) => a.id !== ketua.id && a.id !== wakil.id);

                    return {
                        nama: d.namaDepartemen,
                        desc: d.deskripsi || "",
                        img: d.img ?? null,
                        ketua: { nama: ketua.nama, jabatan: ketua.jabatan, image: ketua.image },
                        wakil: { nama: wakil.nama, jabatan: wakil.jabatan, image: wakil.image },
                        staff: staff.map(s => ({ nama: s.nama, jabatan: s.jabatan, image: s.image }))
                    };
                });
                setDepartemenData(mapped);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const { visibleItems, showAll, hasMore, toggle } = useShowMore(departemenData, 6);

    return (
        <>
            {loading && (
                <div className="flex items-center justify-center gap-3 py-16">
                    <div className="w-5 h-5 border-2 border-[#ffd700]/40 border-t-[#ffd700] rounded-full animate-spin" />
                    <p className="text-[#ffd700]/50 text-sm">Memuat departemen...</p>
                </div>
            )}

            {!loading && departemenData.length === 0 && (
                <p className="text-center text-neutral-400 py-10">Belum ada data departemen.</p>
            )}

            {!loading && departemenData.length > 0 && (
                <>
                    <RevealItem animation="animate-fade-in">
                        <section className="pt-16 pb-4 border-t border-[#2a2a2a]">
                            {/* Grid 2 kolom — mobile native feel */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                                {visibleItems.map((dept, index) => (
                                    <DepartemenCard key={index} dept={dept} />
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

import { useEffect, useState, useMemo } from "react";
import { useShowMore } from "@/hooks/useShowMore";
import { getPengurusInti, getAnggotaDepartemen } from "../services/kepengurusan";
import type { PengurusInti, AnggotaDepartemen } from "../types/kepengurusanTypes";
import ShowMoreButton from "@/components/ShowMoreButton";
import StrukturOrganisasiCard from "./StrukturOrganisasiCard";
import RevealItem from "@/components/RevealItem";

export default function StrukturOrganisasiList() {
    const [pengurusInti, setPengurusInti] = useState<PengurusInti[]>([]);
    const [anggotaDepartemen, setAnggotaDepartemen] = useState<AnggotaDepartemen[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getPengurusInti(), getAnggotaDepartemen()])
            .then(([inti, anggota]) => {
                setPengurusInti(inti);
                setAnggotaDepartemen(anggota);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const { ketua, semuaAnggotaLain } = useMemo(() => {
        const k = pengurusInti.find((p) => p.jabatan?.toLowerCase() === "ketua umum");
        const lain = pengurusInti.filter((p) => p.jabatan?.toLowerCase() !== "ketua umum");
        return {
            ketua: k,
            semuaAnggotaLain: [...lain, ...anggotaDepartemen]
        };
    }, [pengurusInti, anggotaDepartemen]);

    const { visibleItems, showAll, hasMore, toggle } = useShowMore(semuaAnggotaLain, 6);

    return (
        <section className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen py-16 md:py-20 px-4 sm:px-6 md:px-15 border-t border-[#2a2a2a]">
            <RevealItem animation="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-12 text-center">
                    <span className="text-white">Struktur</span> Kepengurusan Aktif
                </h2>
            </RevealItem>

            {loading && <p className="text-center text-[#ffd700]/50 py-20">Memuat...</p>}

            {!loading && pengurusInti.length === 0 && anggotaDepartemen.length === 0 && (
                <p className="text-center text-neutral-400 py-20">Belum ada data kepengurusan.</p>
            )}

            {!loading && (pengurusInti.length > 0 || anggotaDepartemen.length > 0) && (
                <div className="max-w-6xl mx-auto">
                    {/* Ketua */}
                    {ketua && (
                        <RevealItem animation="animate-scale-in" className="flex justify-center mb-10 md:mb-12">
                            <StrukturOrganisasiCard
                                isKetua
                                jabatan={ketua.jabatan}
                                nama={ketua.nama}
                                image={ketua.image}
                                quote={ketua.slogan}
                            />
                        </RevealItem>
                    )}

                    {/* Semua Anggota — grid wrapper animated as a section (may exceed 20 with ShowMore) */}
                    <RevealItem animation="animate-fade-in">
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 lg:gap-8">
                            {visibleItems.map((item) => (
                                <StrukturOrganisasiCard
                                    key={item.id}
                                    jabatan={item.jabatan}
                                    nama={item.nama}
                                    image={item.image}
                                />
                            ))}
                        </div>
                    </RevealItem>
                    {hasMore && (
                        <div className="flex justify-center mt-12">
                            <ShowMoreButton showAll={showAll} onToggle={toggle} />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

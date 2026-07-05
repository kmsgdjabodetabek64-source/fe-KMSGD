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
        let ignore = false;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [inti, anggota] = await Promise.all([
                    getPengurusInti(),
                    getAnggotaDepartemen(),
                ]);

                if (ignore) return;
                setPengurusInti(inti);
                setAnggotaDepartemen(anggota);
            } catch {
                // biarkan kosong
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, []);

    const { pimpinan, semuaAnggotaLain } = useMemo(() => {
        const paraPimpinan = pengurusInti.filter((p) => p.jabatan?.toLowerCase().includes("ketua"));
        const sisaInti = pengurusInti.filter((p) => !p.jabatan?.toLowerCase().includes("ketua"));

        return {
            pimpinan: paraPimpinan,
            semuaAnggotaLain: [...sisaInti, ...anggotaDepartemen]
        };
    }, [pengurusInti, anggotaDepartemen]);

    const { visibleItems, showAll, hasMore, toggle } = useShowMore(semuaAnggotaLain, 6);

    return (
        <section className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen py-10 md:py-14 sm:px-6 md:px-10 border-t border-[#2a2a2a]">
            {loading && <p className="text-center text-[#ffd700]/50 py-12">Memuat...</p>}

            {!loading && pengurusInti.length === 0 && anggotaDepartemen.length === 0 && (
                <p className="text-center text-neutral-400 py-12">Belum ada data kepengurusan.</p>
            )}

            {!loading && (pengurusInti.length > 0 || anggotaDepartemen.length > 0) && (
                <div className="max-w-6xl mx-auto">

                    {/* Baris Utama Pimpinan (Ketua Umum & Wakil Ketua Sejajar) */}
                    {pimpinan.length > 0 && (
                        <RevealItem animation="animate-scale-in" className="mb-8 md:mb-10">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 max-w-3xl mx-auto">
                                {pimpinan.map((bos) => {
                                    const isKetum = bos.jabatan?.toLowerCase() === "ketua umum";
                                    return (
                                        <div key={bos.id} className="w-full flex justify-center">
                                            <StrukturOrganisasiCard
                                                variant={isKetum ? "ketua" : "wakil"}
                                                jabatan={bos.jabatan}
                                                nama={bos.nama}
                                                image={bos.image}
                                                quote={(bos as PengurusInti & { slogan?: string }).slogan}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </RevealItem>
                    )}

                    {/* Semua Anggota Lain — card ukuran tetap, tersusun wrap & center */}
                    <RevealItem animation="animate-fade-in">
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {visibleItems.map((item) => (
                                <StrukturOrganisasiCard
                                    key={item.id}
                                    variant="anggota"
                                    jabatan={item.jabatan}
                                    nama={item.nama}
                                    image={item.image}
                                />
                            ))}
                        </div>
                    </RevealItem>

                    {hasMore && (
                        <div className="flex justify-center mt-6 md:mt-8">
                            <ShowMoreButton showAll={showAll} onToggle={toggle} />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
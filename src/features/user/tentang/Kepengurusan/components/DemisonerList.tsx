import { useEffect, useState } from "react";
import { getSemuaPeriode } from "../services/kepengurusan";
import DemisionerCard from "./DemisionerCard";
import StrukturOrganisasiCard from "./StrukturOrganisasiCard";
import type { PengurusInti } from "../types/kepengurusanTypes";
import { ChevronDown } from "lucide-react";
import RevealItem from "@/components/RevealItem";

interface DemisionerDataGroup {
    periode: string;
    pengurusInti: PengurusInti[];
    departemen: { namaDepartemen: string; anggota: { jabatan: string; nama: string; image?: string | null }[] }[];
}

export default function DemisionerList() {
    const [demisionerData, setDemisionerData] = useState<DemisionerDataGroup[]>([]);
    const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSemuaPeriode()
            .then((data) => {
                const demisioners = data.filter((p) => p.status === "DEMISIONER");
                const mapped: DemisionerDataGroup[] = demisioners.map(d => {
                    const depts = d.departemen ? d.departemen.map(dept => ({
                        namaDepartemen: dept.namaDepartemen,
                        anggota: dept.anggota ? dept.anggota.map((a) => ({
                            jabatan: a.jabatan,
                            nama: a.nama,
                            image: a.image,
                        })) : []
                    })) : [];

                    return {
                        periode: d.periode,
                        pengurusInti: d.pengurusInti || [],
                        departemen: depts
                    };
                });
                setDemisionerData(mapped);
                if (mapped.length > 0) {
                    setSelectedPeriode(mapped[0].periode);
                }
            })
            .catch(() => setError("Gagal memuat data demisioner."))
            .finally(() => setLoading(false));
    }, []);

    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleOpen = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <>
            {loading && <p className="text-center text-[#ffd700]/50 py-10">Memuat demisioner...</p>}
            {error && <p className="text-center text-red-400 py-10">{error}</p>}

            {!loading && !error && demisionerData.length === 0 && (
                <p className="text-center text-neutral-400 py-10">Belum ada data demisioner.</p>
            )}

            {!loading && !error && demisionerData.length > 0 && (
                <RevealItem animation="animate-fade-in">
                    <section className="pt-10 pb-4 sm:px-6 md:px-10 border-t border-[#2a2a2a] flex flex-col gap-10">
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <label htmlFor="periode-select" className="text-white text-lg font-semibold font-['Montserrat']">
                                Pilih Periode Demisioner
                            </label>
                            <div className="relative min-w-62.5">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full bg-[#111] text-[#ffd700] border border-[#ffd700]/50 p-3 outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors text-center text-lg font-semibold cursor-pointer flex items-center justify-between gap-4"
                                >
                                    <span className="flex-1 text-center">{selectedPeriode}</span>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-[#111] border border-[#ffd700]/50 border-t-0">
                                        {demisionerData.map(d => (
                                            <button
                                                key={d.periode}
                                                type="button"
                                                onClick={() => { setSelectedPeriode(d.periode); setDropdownOpen(false); }}
                                                className={`w-full px-4 py-3 text-center text-sm font-semibold cursor-pointer transition-colors
                        ${selectedPeriode === d.periode
                                                        ? "bg-[#ffd700] text-black"
                                                        : "text-[#ffd700] hover:bg-[#ffd700]/10"
                                                    }`}
                                            >
                                                {d.periode}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {(() => {
                            const group = demisionerData.find(d => d.periode === selectedPeriode);
                            if (!group) return null;

                            // Samakan logika dengan StrukturOrganisasiList:
                            // pakai filter (bukan find) supaya Ketua Umum & Wakil Ketua
                            // sama-sama tertangkap sebagai "pimpinan"
                            const pimpinan = group.pengurusInti.filter((p) => p.jabatan?.toLowerCase().includes("ketua"));
                            const lain = group.pengurusInti.filter((p) => !p.jabatan?.toLowerCase().includes("ketua"));

                            return (
                                <div className="mb-8">
                                    {/* BPI Section */}
                                    {group.pengurusInti.length > 0 && (
                                        <div className="mb-14">
                                            <RevealItem animation="animate-fade-in-up">
                                                <h4 className="text-xl font-semibold text-white mb-8 text-center">Badan Pengurus Inti</h4>
                                            </RevealItem>

                                            {/* Ketua Umum & Wakil Ketua sejajar, sama seperti StrukturOrganisasiList */}
                                            {pimpinan.length > 0 && (
                                                <RevealItem animation="animate-scale-in" className="mb-8 md:mb-10">
                                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 max-w-3xl mx-auto">
                                                        {pimpinan.map((p) => {
                                                            const isKetum = p.jabatan?.toLowerCase() === "ketua umum";
                                                            return (
                                                                <div key={p.id ?? p.jabatan} className="w-full flex justify-center">
                                                                    <StrukturOrganisasiCard
                                                                        variant={isKetum ? "ketua" : "wakil"}
                                                                        jabatan={p.jabatan}
                                                                        nama={p.nama}
                                                                        image={p.image}
                                                                        quote={isKetum ? p.slogan : undefined}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </RevealItem>
                                            )}

                                            {/* Anggota inti lain, pakai flex-wrap seperti StrukturOrganisasiList */}
                                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                                {lain.map((p, idx) => (
                                                    <StrukturOrganisasiCard
                                                        key={p.id ?? idx}
                                                        variant="anggota"
                                                        jabatan={p.jabatan}
                                                        nama={p.nama}
                                                        image={p.image}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Departemen Section */}
                                    {group.departemen.length > 0 && (
                                        <div>
                                            <RevealItem animation="animate-fade-in-up">
                                                <h4 className="text-xl font-semibold text-white mb-6 text-center">Departemen</h4>
                                            </RevealItem>
                                            <div className="space-y-5">
                                                {group.departemen.map((dept, deptIdx) => (
                                                    <DemisionerCard
                                                        key={deptIdx}
                                                        periode={group.periode}
                                                        namaDepartemen={dept.namaDepartemen}
                                                        anggota={dept.anggota}
                                                        isOpen={openIndex === deptIdx.toString()}
                                                        onToggle={() => toggleOpen(deptIdx.toString())}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </section>
                </RevealItem>
            )}
        </>
    );
}
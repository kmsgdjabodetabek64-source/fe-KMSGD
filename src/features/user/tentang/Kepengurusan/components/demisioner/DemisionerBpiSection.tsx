import StrukturOrganisasiCard from "../StrukturOrganisasiCard";
import RevealItem from "@/components/RevealItem";
import type { PengurusInti } from "../../types/kepengurusanTypes";

interface BpiSectionProps {
    pengurusInti: PengurusInti[];
}

export function DemisionerBpiSection({ pengurusInti }: BpiSectionProps) {
    if (pengurusInti.length === 0) return null;

    // Samakan logika dengan StrukturOrganisasiList:
    // pakai filter (bukan find) supaya Ketua Umum & Wakil Ketua
    // sama-sama tertangkap sebagai "pimpinan"
    const pimpinan = pengurusInti.filter((p) => p.jabatan?.toLowerCase().includes("ketua"));
    const lain = pengurusInti.filter((p) => !p.jabatan?.toLowerCase().includes("ketua"));

    return (
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
    );
}
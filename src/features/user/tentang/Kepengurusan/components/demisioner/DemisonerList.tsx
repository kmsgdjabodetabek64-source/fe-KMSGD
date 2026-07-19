import { useState } from "react";
import { useDemisionerData } from "@/hooks/useDemisionerData";
import { PeriodeDropdown } from "./PeriodeDropdown";
import { DemisionerBpiSection } from "./DemisionerBpiSection";
import { DepartemenSection } from "./DepartemenSection";
import RevealItem from "@/components/RevealItem";

export default function DemisionerList() {
    const { demisionerData, selectedPeriode, setSelectedPeriode, loading, error } = useDemisionerData();
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleOpen = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const group = demisionerData.find((d) => d.periode === selectedPeriode);

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
                        <PeriodeDropdown
                            data={demisionerData}
                            selectedPeriode={selectedPeriode}
                            onSelect={setSelectedPeriode}
                        />

                        {group && (
                            <div className="mb-8">
                                <DemisionerBpiSection pengurusInti={group.pengurusInti} />
                                <DepartemenSection
                                    periode={group.periode}
                                    departemen={group.departemen}
                                    openIndex={openIndex}
                                    onToggle={toggleOpen}
                                />
                            </div>
                        )}
                    </section>
                </RevealItem>
            )}
        </>
    );
}
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DemisionerDataGroup } from "../../types/demisionerTypes";

interface PeriodeDropdownProps {
    data: DemisionerDataGroup[];
    selectedPeriode: string | null;
    onSelect: (periode: string) => void;
}

export function PeriodeDropdown({ data, selectedPeriode, onSelect }: PeriodeDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
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
                        {data.map((d) => (
                            <button
                                key={d.periode}
                                type="button"
                                onClick={() => {
                                    onSelect(d.periode);
                                    setDropdownOpen(false);
                                }}
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
    );
}
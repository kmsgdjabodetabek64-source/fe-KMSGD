import DemisionerCard from "./DemisionerCard";
import RevealItem from "@/components/RevealItem";
import type { DemisionerDepartemen } from "../../types/demisionerTypes";

interface DepartemenSectionProps {
    periode: string;
    departemen: DemisionerDepartemen[];
    openIndex: string | null;
    onToggle: (id: string) => void;
}

export function DepartemenSection({ periode, departemen, openIndex, onToggle }: DepartemenSectionProps) {
    if (departemen.length === 0) return null;

    return (
        <div>
            <RevealItem animation="animate-fade-in-up">
                <h4 className="text-xl font-semibold text-white mb-6 text-center">Departemen</h4>
            </RevealItem>
            <div className="space-y-5">
                {departemen.map((dept, deptIdx) => (
                    <DemisionerCard
                        key={deptIdx}
                        periode={periode}
                        namaDepartemen={dept.namaDepartemen}
                        anggota={dept.anggota}
                        isOpen={openIndex === deptIdx.toString()}
                        onToggle={() => onToggle(deptIdx.toString())}
                    />
                ))}
            </div>
        </div>
    );
}
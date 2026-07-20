import RevealItem from "@/components/RevealItem";
import type { DemisionerDepartemen } from "../../types/demisionerTypes";
import GroupPhotoCard from "../GroupPhotoCard";

interface DepartemenSectionProps {
    departemen: DemisionerDepartemen[];
}

export function DepartemenSection({ departemen }: DepartemenSectionProps) {
    if (departemen.length === 0) return null;

    return (
        <div className="mt-10">
            <RevealItem animation="animate-fade-in-up">
                <h4 className="text-base sm:text-xl font-semibold mb-5 text-center tracking-wide uppercase text-[#ffd700]/80">
                    Departemen
                </h4>
            </RevealItem>

            {/* Grid 2 kolom — identik dengan DepartemenList & BKList */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {departemen.map((dept, idx) => (
                    <RevealItem key={idx} animation="animate-fade-in-up">
                        <GroupPhotoCard
                            nama={dept.namaDepartemen}
                            img={dept.img}
                            anggota={dept.anggota}
                        />
                    </RevealItem>
                ))}
            </div>
        </div>
    );
}
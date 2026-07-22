import { FaSitemap, FaPlus } from "react-icons/fa";
import type { PeriodeOrganisasi } from "../../kepengurusanTypes";

type PeriodeOption = Pick<PeriodeOrganisasi, "id" | "periode" | "status">;

interface Props {
    periodes: PeriodeOption[];
    viewPeriodeId: number | null;
    onPeriodeChange: (id: number) => void;
    onAddClick: () => void;
}

const DepartemenHeader = ({ periodes, viewPeriodeId, onPeriodeChange, onAddClick }: Props) => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 text-[#ffd700]">
                <FaSitemap className="text-xl" />
                <h2 className="text-xl font-bold">Departemen</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <select
                    value={viewPeriodeId || ""}
                    onChange={(e) => onPeriodeChange(Number(e.target.value))}
                    className="bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-yellow-400 w-full sm:w-auto"
                >
                    {periodes.map((p) => (
                        <option key={p.id} value={p.id} className="bg-neutral-800">
                            {p.periode} ({p.status})
                        </option>
                    ))}
                </select>
                <button
                    onClick={onAddClick}
                    className="flex justify-center items-center gap-2 border border-yellow-400 text-[#ffd700] px-4 py-2 font-semibold hover:bg-yellow-400 hover:text-black transition-colors w-full sm:w-auto"
                >
                    <FaPlus />
                    Tambah Departemen
                </button>
            </div>
        </div>
    );
};

export default DepartemenHeader;
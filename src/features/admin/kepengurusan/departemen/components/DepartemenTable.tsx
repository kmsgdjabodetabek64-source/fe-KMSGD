import { useMemo } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaImage, FaUsers } from "react-icons/fa";
import Table, { type Column } from "@/components/TableAdmin";
import type { Departemen } from "../../kepengurusanTypes";

interface Props {
    data: Departemen[];
    loading: boolean;
    expandedDept: number | null;
    onToggleExpand: (id: number) => void;
    onEditClick: (dept: Departemen) => void;
    onDeleteClick: (id: number) => void;
    onAddAnggotaClick: (deptId: number) => void;
    onDeleteAnggotaClick: (id: number) => void;
}

const DepartemenTable = ({
    data,
    loading,
    expandedDept,
    onToggleExpand,
    onEditClick,
    onDeleteClick,
    onAddAnggotaClick,
    onDeleteAnggotaClick,
}: Props) => {
    const columns = useMemo<Column<Departemen>[]>(() => [
        {
            header: "Foto",
            render: (d) => (
                <div className="w-32 h-32 bg-[#1a1a1a] overflow-hidden border border-[#2a2a2a] flex items-center justify-center shrink-0">
                    {d.img ? (
                        <img
                            src={d.img}
                            alt={d.namaDepartemen}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    ) : (
                        <FaImage className="text-[#3a3a3a] text-3xl" />
                    )}
                </div>
            ),
        },
        {
            header: "Nama Departemen",
            cellClassName: "text-[#ffd700] font-semibold max-w-60",
            render: (d) => (
                <div>
                    <p className="m-0">{d.namaDepartemen}</p>
                    {d.deskripsi && (
                        <p className="text-[#777] text-xs mt-1 font-normal md:hidden line-clamp-2">
                            {d.deskripsi}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Deskripsi",
            headerClassName: "hidden md:table-cell",
            cellClassName: "text-[#777] max-w-70 hidden md:table-cell",
            render: (d) => (
                <p className="line-clamp-2 m-0">
                    {d.deskripsi || "—"}
                </p>
            ),
        },
        {
            header: "Anggota",
            headerClassName: "text-center",
            cellClassName: "text-center",
            render: (d) => (
                <span className="inline-flex items-center gap-1.5 bg-[#1a1a0a] border border-[#b8982a]/40 text-[#ffd700] text-xs py-1 px-2.5 whitespace-nowrap">
                    <FaUsers className="text-[10px]" />
                    {d.anggota?.length ?? 0}
                </span>
            ),
        },
        {
            header: "Aksi",
            render: (d) => (
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => onToggleExpand(d.id)}
                        className="bg-transparent border border-[#2a2a2a] text-[#ffd700] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                        {expandedDept === d.id ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                        Anggota
                    </button>
                    <button
                        onClick={() => onEditClick(d)}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(d.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], [expandedDept, onToggleExpand, onEditClick, onDeleteClick]);

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            rowKey={(d) => d.id}
            emptyMessage="Belum ada departemen untuk periode yang dipilih."
            isExpanded={(d) => expandedDept === d.id}
            renderExpanded={(d) => (
                <div className="px-6 py-4 border-l-4 border-l-[#b8982a]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h4 className="text-[#777] text-sm font-medium flex items-center gap-2 m-0">
                            <FaUsers className="text-[#b8982a]" />
                            Daftar Anggota — <span className="text-[#ffd700]">{d.namaDepartemen}</span>
                        </h4>
                        <button
                            onClick={() => onAddAnggotaClick(d.id)}
                            className="flex items-center gap-1.5 text-[#ffd700] text-xs font-semibold border border-[#b8982a]/50 py-1.5 px-3 hover:bg-[#b8982a]/10 transition-colors"
                        >
                            <FaPlus className="text-[10px]" />
                            Tambah Anggota
                        </button>
                    </div>

                    {d.anggota && d.anggota.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-[#777] text-xs border-b border-[#2a2a2a]">
                                        <th className="pb-2 font-medium text-left w-8">#</th>
                                        <th className="pb-2 font-medium text-left">Anggota</th>
                                        <th className="pb-2 font-medium text-left hidden sm:table-cell">Jabatan</th>
                                        <th className="pb-2 font-medium text-center w-16">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {d.anggota.map((anggota, aIdx) => (
                                        <tr
                                            key={anggota.id}
                                            className="border-b border-[#2a2a2a]/60 last:border-0 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-2.5 text-[#555] text-xs font-mono">
                                                {aIdx + 1}
                                            </td>
                                            <td className="py-2.5">
                                                <div className="flex items-center gap-3">
                                                    {anggota.image ? (
                                                        <img
                                                            src={anggota.image}
                                                            alt={anggota.nama}
                                                            className="w-12 h-12 object-cover shrink-0 border border-[#2a2a2a]"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffd700] font-bold flex items-center justify-center text-xs shrink-0">
                                                            {anggota.nama.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-[#eaeaea] text-sm font-medium m-0">{anggota.nama}</p>
                                                        <p className="text-[#ffd700] text-xs sm:hidden m-0">{anggota.jabatan}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2.5 hidden sm:table-cell">
                                                <span className={`text-xs py-0.5 px-2 ${anggota.jabatan.toLowerCase() !== "anggota"
                                                    ? "bg-[#1a1a0a] text-[#ffd700] border border-[#b8982a]/30"
                                                    : "text-[#777]"
                                                    }`}>
                                                    {anggota.jabatan}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-center">
                                                <button
                                                    onClick={() => onDeleteAnggotaClick(anggota.id)}
                                                    className="text-[#777] hover:text-[#f09595] transition-colors p-1.5"
                                                >
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-[#555] text-sm italic">
                            Belum ada anggota di departemen ini.
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export default DepartemenTable;
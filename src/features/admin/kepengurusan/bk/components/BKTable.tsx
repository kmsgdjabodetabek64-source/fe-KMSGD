import { useMemo } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaImage, FaUsers } from "react-icons/fa";
import Table, { type Column } from "@/components/TableAdmin";
import type { BadanKhusus } from "../../kepengurusanTypes";

interface Props {
    data: BadanKhusus[];
    loading: boolean;
    expandedBK: number | null;
    onToggleExpand: (id: number) => void;
    onEditClick: (bk: BadanKhusus) => void;
    onDeleteClick: (id: number) => void;
    onAddAnggotaClick: (bkId: number) => void;
    onDeleteAnggotaClick: (id: number) => void;
}

const BKTable = ({
    data,
    loading,
    expandedBK,
    onToggleExpand,
    onEditClick,
    onDeleteClick,
    onAddAnggotaClick,
    onDeleteAnggotaClick,
}: Props) => {
    const columns = useMemo<Column<BadanKhusus>[]>(() => [
        {
            header: "Foto",
            render: (bk) => (
                <div className="w-32 h-32 bg-[#1a1a1a] overflow-hidden border border-[#2a2a2a] flex items-center justify-center shrink-0">
                    {bk.img ? (
                        <img
                            src={bk.img}
                            alt={bk.namaBK}
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
            header: "Nama Badan Khusus",
            cellClassName: "text-[#ffd700] font-semibold max-w-60",
            render: (bk) => (
                <div>
                    <p className="m-0">{bk.namaBK}</p>
                    {bk.deskripsi && (
                        <p className="text-[#777] text-xs mt-1 font-normal md:hidden line-clamp-2">
                            {bk.deskripsi}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Deskripsi",
            headerClassName: "hidden md:table-cell",
            cellClassName: "text-[#777] max-w-70 hidden md:table-cell",
            render: (bk) => (
                <p className="line-clamp-2 m-0">
                    {bk.deskripsi || "—"}
                </p>
            ),
        },
        {
            header: "Anggota",
            headerClassName: "text-center",
            cellClassName: "text-center",
            render: (bk) => (
                <span className="inline-flex items-center gap-1.5 bg-[#1a1a0a] border border-[#b8982a]/40 text-[#ffd700] text-xs py-1 px-2.5 whitespace-nowrap">
                    <FaUsers className="text-[10px]" />
                    {bk.anggota?.length ?? 0}
                </span>
            ),
        },
        {
            header: "Aksi",
            render: (bk) => (
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => onToggleExpand(bk.id)}
                        className="bg-transparent border border-[#2a2a2a] text-[#ffd700] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                        {expandedBK === bk.id ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                        Anggota
                    </button>
                    <button
                        onClick={() => onEditClick(bk)}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(bk.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], [expandedBK, onToggleExpand, onEditClick, onDeleteClick]);

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            rowKey={(bk) => bk.id}
            emptyMessage="Belum ada badan khusus untuk periode yang dipilih."
            isExpanded={(bk) => expandedBK === bk.id}
            renderExpanded={(bk) => (
                <div className="px-6 py-4 border-l-4 border-l-[#b8982a]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h4 className="text-[#777] text-sm font-medium flex items-center gap-2 m-0">
                            <FaUsers className="text-[#b8982a]" />
                            Daftar Anggota — <span className="text-[#ffd700]">{bk.namaBK}</span>
                        </h4>
                        <button
                            onClick={() => onAddAnggotaClick(bk.id)}
                            className="flex items-center gap-1.5 text-[#ffd700] text-xs font-semibold border border-[#b8982a]/50 py-1.5 px-3 hover:bg-[#b8982a]/10 transition-colors"
                        >
                            <FaPlus className="text-[10px]" />
                            Tambah Anggota
                        </button>
                    </div>

                    {bk.anggota && bk.anggota.length > 0 ? (
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
                                    {bk.anggota.map((anggota, aIdx) => (
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
                            Belum ada anggota di badan khusus ini.
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export default BKTable;
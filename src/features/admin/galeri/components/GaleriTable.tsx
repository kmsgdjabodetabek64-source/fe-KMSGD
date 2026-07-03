import { useMemo } from "react";
import type { Galeri } from "../galeriType";
import Table, { type Column } from "@/components/TableAdmin";

interface Props {
    data: Galeri[];
    loading: boolean;
    onEditClick: (galeri: Galeri) => void;
    onDeleteClick: (id: number) => void;
}

const GaleriTable = ({ data, loading, onEditClick, onDeleteClick }: Props) => {
    const columns = useMemo<Column<Galeri>[]>(() => [
        {
            header: "Foto",
            render: (g) => (
                <div className="w-54 bg-[#1a1a1a] overflow-hidden border border-[#2a2a2a]">
                    <img
                        src={g.tipe === "VIDEO" ? (g.thumbnail ?? "") : g.url}
                        alt={g.judul ?? "Galeri"}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                </div>
            ),
        },
        {
            header: "Judul",
            cellClassName: "text-[#ffd700] font-semibold max-w-60 truncate",
            render: (g) => g.judul || "Tanpa judul",
        },
        {
            header: "Kegiatan",
            cellClassName: "text-[#777] max-w-50 truncate",
            render: (g) => g.kegiatan ? g.kegiatan.title : "—",
        },
        {
            header: "Status",
            render: (g) => (
                <span className={`inline-block border py-0.5 px-2.5 text-xs whitespace-nowrap ${
                    g.isPublished ? "bg-[#0a1a0a] border-[#3b6d11] text-[#97c459]" : "bg-[#1a0a0a] border-[#7a1a1a] text-[#f09595]"
                }`}>
                    {g.isPublished ? "Publik" : "Draft"}
                </span>
            ),
        },
        {
            header: "Aksi",
            render: (g) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEditClick(g)}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(g.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], [onEditClick, onDeleteClick]);

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            rowKey={(g) => g.id}
            emptyMessage="Belum ada galeri."
        />
    );
};

export default GaleriTable;
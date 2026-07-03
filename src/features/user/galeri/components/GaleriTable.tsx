import { useMemo } from "react";
import type { GaleriItem } from "../services/galeriService";
import Table, { type Column } from "@/components/TableAdmin";

interface Props {
    data: GaleriItem[];
    loading: boolean;
    page: number;
    perPage: number;
    onDeleteClick: (id: number) => void;
}

const GaleriTable = ({ data, loading, page, perPage, onDeleteClick }: Props) => {

    // Menggunakan useMemo demi performa render maksimal
    const columns = useMemo<Column<GaleriItem>[]>(() => [
        {
            header: "#",
            cellClassName: "text-zinc-500 tabular-nums",
            render: (_, globalIndex) => globalIndex,
        },
        {
            header: "Media",
            render: (g) => {
                // Jika tipe VIDEO, gunakan g.thumbnail (jika tidak ada pasang placeholder), jika FOTO pakai g.url
                const displayImage = g.tipe === "VIDEO"
                    ? (g.thumbnail || "https://via.placeholder.com/640x360?text=Video")
                    : g.url;

                return (
                    <img
                        src={displayImage}
                        alt={g.judul || "Media Galeri"}
                        className="w-15 h-10 object-cover border border-[#2a2a2a] block"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                );
            },
        },
        {
            header: "Tipe",
            render: (g) => (
                <span className={`border py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap ${g.tipe === "VIDEO"
                    ? "bg-[#0d1a0d] border-[#3b6d11] text-[#97c459]" // Hijau untuk Video
                    : "bg-[#1a1500] border-[#b8982a] text-[#ffd700]" // Emas untuk Foto
                    }`}>
                    {g.tipe === "VIDEO" ? "Video" : "Foto"}
                </span>
            ),
        },
        {
            header: "Judul",
            cellClassName: "max-w-48",
            render: (g) => (
                <div className="font-semibold text-[#ffd700] mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {g.judul || "Tanpa Judul"}
                </div>
            ),
        },
        {
            header: "Link / URL",
            cellClassName: "max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-zinc-400",
            render: (g) => (
                <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer" // Aman dari celah keamanan tab hijacking
                    className="hover:text-[#ffd700] underline text-xs break-all"
                >
                    {g.url}
                </a>
            ),
        },
        {
            header: "Aksi",
            render: (g) => (
                <div className="flex gap-2">
                    <a
                        href={`/admin/galeri/edit/${g.id}`}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer no-underline tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </a>
                    <button
                        onClick={() => onDeleteClick(g.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], [onDeleteClick]);

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            page={page}
            perPage={perPage}
            rowKey={(g) => g.id}
            emptyMessage="Tidak ada item galeri ditemukan."
            loadingMessage="Memuat data..."
        />
    );
};

export default GaleriTable;
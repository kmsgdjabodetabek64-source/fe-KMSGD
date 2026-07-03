import { useMemo } from "react";
import type { Pengumuman } from "../pengumumanTypes";
import Table, { type Column } from "@/components/TableAdmin";

interface Props {
    data: Pengumuman[];
    loading: boolean;
    page: number;
    perPage: number;
    onDeleteClick: (id: number) => void;
}

const formatTanggal = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const PengumumanTable = ({ data, loading, page, perPage, onDeleteClick }: Props) => {

    const columns = useMemo<Column<Pengumuman>[]>(() => [
        {
            header: "#",
            cellClassName: "text-zinc-500 tabular-nums",
            render: (_, globalIndex) => globalIndex,
        },
        {
            header: "Gambar",
            render: (p) => p.image ? (
                <img
                    src={p.image}
                    alt={p.title}
                    className="w-54 object-cover border border-[#2a2a2a] block"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
            ) : (
                <div className="w-15 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[0.65rem] text-[#444]">
                    No img
                </div>
            ),
        },
        {
            header: "Tanggal",
            cellClassName: "text-[#ccc] whitespace-nowrap",
            // FIX: Menggunakan p.createdAt karena p.date tidak ada di tipe Pengumuman
            render: (p) => formatTanggal(p.tanggal),
        },
        {
            header: "Judul",
            cellClassName: "max-w-48",
            render: (p) => (
                <div className="font-semibold text-[#ffd700] mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {p.title}
                </div>
            ),
        },
        {
            header: "Kategori",
            render: (p) => (
                <span className="bg-[#1a1500] border border-[#b8982a] text-[#ffd700] py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap">
                    {p.kategori?.nama || "Umum"}
                </span>
            ),
        },
        {
            header: "Penting",
            render: (p) => (
                // FIX: Menggunakan p.isPenting (sesuaikan jika di type kamu namanya 'penting' atau 'isPenting')
                <span className={`border py-0.5 px-2.5 text-xs whitespace-nowrap ${p.isPenting
                    ? "bg-[#1a0a0a] border-[#7a1a1a] text-[#f09595]"
                    : "bg-[#1a1a1a] border-[#444] text-zinc-400"
                    }`}>
                    {p.isPenting ? "Penting" : "Biasa"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (p) => (
                <span className={`border py-0.5 px-2.5 text-xs whitespace-nowrap ${p.isPublished
                    ? "bg-[#0a1a0a] border-[#3b6d11] text-[#97c459]"
                    : "bg-[#1a0a0a] border-[#7a1a1a] text-[#f09595]"
                    }`}>
                    {p.isPublished ? "Publik" : "Draft"}
                </span>
            ),
        },
        {
            header: "Aksi",
            render: (p) => (
                <div className="flex gap-2">
                    <a
                        href={`/admin/pengumuman/edit/${p.id}`}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer no-underline tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </a>
                    <button
                        onClick={() => onDeleteClick(p.id)}
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
            rowKey={(p) => p.id}
            emptyMessage="Tidak ada pengumuman ditemukan."
            loadingMessage="Memuat data..."
        />
    );
};

export default PengumumanTable;
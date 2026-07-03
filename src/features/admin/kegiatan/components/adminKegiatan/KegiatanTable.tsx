import { useMemo } from "react";
import type { Kegiatan } from "../../kegiatanTypes";
import TableAdmin, { type Column } from "@/components/TableAdmin";

interface Props {
    data: Kegiatan[];
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

const KegiatanTable = ({ data, loading, page, perPage, onDeleteClick }: Props) => {
    const columns = useMemo<Column<Kegiatan>[]>(() => [
        {
            header: "#",
            cellClassName: "text-zinc-500 tabular-nums",
            render: (_, globalIndex) => globalIndex,
        },
        {
            header: "Gambar",
            render: (k) => k.image ? (
                <img
                    src={k.image}
                    alt={k.title}
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
            render: (k) => formatTanggal(k.startTime),
        },
        {
            header: "Judul",
            cellClassName: "max-w-48",
            render: (k) => (
                <>
                    <div className="font-semibold text-[#ffd700] mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        {k.title}
                    </div>
                    {k.organizerCustom && <div className="text-xs text-[#777]">{k.organizerCustom}</div>}
                </>
            ),
        },
        {
            header: "Kategori",
            render: (k) => (
                <span className="bg-[#1a1500] border border-[#b8982a] text-[#ffd700] py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap">
                    {k.kategori.nama}
                </span>
            ),
        },
        {
            header: "Departemen",
            render: (k) => k.departemen ? (
                <span className="bg-[#0d1a0d] border border-[#3b6d11] text-[#97c459] py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap">
                    {k.departemen.namaDepartemen}
                </span>
            ) : (
                <span className="text-zinc-600 text-xs">—</span>
            ),
        },
        {
            header: "Lokasi",
            cellClassName: "text-[#ccc] max-w-36 overflow-hidden text-ellipsis whitespace-nowrap",
            render: (k) => k.location,
        },
        {
            header: "Status",
            render: (k) => (
                <span className={`border py-0.5 px-2.5 text-xs whitespace-nowrap ${k.isPublished ? "bg-[#0a1a0a] border-[#3b6d11] text-[#97c459]" : "bg-[#1a0a0a] border-[#7a1a1a] text-[#f09595]"
                    }`}>
                    {k.isPublished ? "Publik" : "Draft"}
                </span>
            ),
        },
        {
            header: "Aksi",
            render: (k) => (
                <div className="flex gap-2">
                    <a
                        href={`/admin/kegiatan/edit/${k.id}`}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer no-underline tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </a>
                    <button
                        onClick={() => onDeleteClick(k.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], [onDeleteClick]);

    return (
        <TableAdmin
            data={data}
            columns={columns}
            loading={loading}
            page={page}
            perPage={perPage}
            rowKey={(k) => k.id}
        />
    );
};

export default KegiatanTable;
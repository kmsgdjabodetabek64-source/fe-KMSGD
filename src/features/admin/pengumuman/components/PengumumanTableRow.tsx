import type { Pengumuman } from "../pengumumanTypes";

interface Props {
    pengumuman: Pengumuman;
    index: number;
    onDeleteClick: (id: number) => void;
}

const formatTanggal = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const PengumumanTableRow = ({ pengumuman: p, index, onDeleteClick }: Props) => {
    return (
        <tr className="border-b border-[#2a2a2a] bg-transparent hover:bg-[#111] transition-colors duration-150">
            <td className="py-6 px-3 text-zinc-500 tabular-nums">{index}</td>

            <td className="py-6 px-3">
                {p.image ? (
                    <img
                        src={p.image}
                        alt={p.title}
                        className="w-15 h-10 object-cover border border-[#2a2a2a] block"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-15 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[0.65rem] text-[#444]">
                        No img
                    </div>
                )}
            </td>

            <td className="py-6 px-3 text-[#ccc] whitespace-nowrap">
                {formatTanggal(p.tanggal)}
            </td>

            <td className="py-6 px-3 max-w-48">
                <div className="font-semibold text-[#ffd700] mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {p.title}
                </div>
                <div className="text-xs text-[#777]">{p.author}</div>
            </td>

            <td className="py-6 px-3">
                <span className="bg-[#1a1500] border border-[#b8982a] text-[#ffd700] py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap">
                    {p.kategori.nama}
                </span>
            </td>

            <td className="py-6 px-3">
                {p.isPenting ? (
                    <span className="bg-[#2a1500] border border-[#cc6600] text-[#ffaa55] py-0.5 px-2.5 text-xs tracking-wider whitespace-nowrap">
                        Penting
                    </span>
                ) : (
                    <span className="text-zinc-600 text-xs">—</span>
                )}
            </td>

            <td className="py-6 px-3">
                <span
                    className={`border py-0.5 px-2.5 text-xs whitespace-nowrap ${p.isPublished
                        ? "bg-[#0a1a0a] border-[#3b6d11] text-[#97c459]"
                        : "bg-[#1a0a0a] border-[#7a1a1a] text-[#f09595]"
                        }`}
                >
                    {p.isPublished ? "Publik" : "Draft"}
                </span>
            </td>

            <td className="py-6 px-3">
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
            </td>
        </tr >
    );
};

export default PengumumanTableRow;
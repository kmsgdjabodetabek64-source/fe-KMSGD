interface KegiatanToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function KegiatanToolbar({ search, onSearchChange }: KegiatanToolbarProps) {
    return (
        <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
            <input
                type="text"
                placeholder="Cari judul, kategori, departemen, lokasi..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-[#1a1a1a] border border-[#ffd700] text-[#ffd700] py-2 px-3.5 text-sm outline-none w-80 focus:ring-1 focus:ring-[#ffd700]"
            />
            <a
                href="/admin/kegiatan/tambah"
                className="bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm no-underline tracking-wider hover:bg-[#b8982a]/90 transition-colors"
            >
                + Tambah Kegiatan
            </a>
        </div >
    );
}
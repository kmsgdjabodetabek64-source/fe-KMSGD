interface PengumumanFormHeaderProps {
    isEdit: boolean;
}

export default function PengumumanFormHeader({ isEdit }: PengumumanFormHeaderProps) {
    return (
        <div className="mb-8 pb-4 border-b border-yellow-700">
            <a href="/admin/pengumuman" className="text-yellow-600 text-xs tracking-widest hover:text-[#ffd700] transition-colors">
                ← Kembali
            </a>
            <h1 className="text-3xl font-bold text-[#ffd700] mt-2 mb-1">
                {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </h1>
            <p className="text-yellow-600 text-sm">
                {isEdit ? "Perbarui data pengumuman di bawah ini" : "Isi form berikut untuk menambah pengumuman baru"}
            </p>
        </div>
    );
}
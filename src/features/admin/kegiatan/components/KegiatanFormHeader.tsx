interface KegiatanFormHeaderProps {
    isEditMode: boolean;
    onBack: () => void;
}

export default function KegiatanFormHeader({ isEditMode, onBack }: KegiatanFormHeaderProps) {
    return (
        <div className="mb-8 pb-4 border-b border-yellow-700">
            <button
                type="button"
                onClick={onBack}
                className="bg-transparent border-none p-0 text-yellow-600 text-xs tracking-widest hover:text-[#ffd700] transition-colors cursor-pointer"
            >
                ← Kembali
            </button>
            <h1 className="text-3xl font-bold text-[#ffd700] mt-2 mb-1">
                {isEditMode ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </h1>
            <p className="text-yellow-600 text-sm">
                {isEditMode ? "Perbarui informasi kegiatan" : "Isi form berikut untuk menambah kegiatan baru"}
            </p>
        </div>
    );
}
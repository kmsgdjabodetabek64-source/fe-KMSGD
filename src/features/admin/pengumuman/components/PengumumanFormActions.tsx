interface PengumumanFormActionsProps {
    loading: boolean;
    isEdit: boolean;
}

export default function PengumumanFormActions({ loading, isEdit }: PengumumanFormActionsProps) {
    return (
        <div className="flex gap-3 pt-4 border-t border-neutral-900">
            <a
                href="/admin/pengumuman"
                className="border border-neutral-700 text-neutral-500 px-6 py-2.5 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors"
            >
                Batal
            </a>
            <button
                type="submit"
                disabled={loading}
                className={`px-8 py-2.5 text-sm font-bold tracking-widest transition-colors ${
                    loading
                        ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                        : "bg-yellow-600 text-black cursor-pointer hover:bg-yellow-500"
                }`}
            >
                {loading ? (isEdit ? "Memperbarui..." : "Menyimpan...") : isEdit ? "Update Pengumuman" : "Simpan Pengumuman"}
            </button>
        </div >
    );
}
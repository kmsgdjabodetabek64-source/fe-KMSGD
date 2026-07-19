interface KegiatanFormActionsProps {
    loading: boolean;
    disabled: boolean;
    isEditMode: boolean;
    onCancel: () => void;
}

export default function KegiatanFormActions({ loading, disabled, isEditMode, onCancel }: KegiatanFormActionsProps) {
    return (
        <div className="flex gap-3 pt-4 border-t border-neutral-900">
            <button
                type="button"
                onClick={onCancel}
                className="border border-neutral-700 bg-transparent text-neutral-500 px-6 py-2.5 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            >
                Batal
            </button>
            <button
                type="submit"
                disabled={disabled}
                className={`px-8 py-2.5 text-sm font-bold tracking-widest transition-colors border-none ${disabled
                    ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                    : "bg-yellow-600 text-black cursor-pointer hover:bg-yellow-500"
                    }`}
            >
                {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan Kegiatan"}
            </button>
        </div>
    );
}
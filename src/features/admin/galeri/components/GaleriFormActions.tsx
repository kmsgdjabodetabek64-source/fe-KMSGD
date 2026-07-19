interface GaleriFormActionsProps {
    loading: boolean;
    onCancel: () => void;
}

export default function GaleriFormActions({ loading, onCancel }: GaleriFormActionsProps) {
    return (
        <div className="flex gap-3 justify-end pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="bg-transparent border border-zinc-700 text-zinc-400 py-2 px-5 cursor-pointer text-sm hover:bg-zinc-900 transition-colors"
            >
                Batal
            </button>
            <button
                type="submit"
                disabled={loading}
                className={`py-2 px-5 text-sm font-bold tracking-wider transition-colors ${loading
                    ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                    : "bg-[#b8982a] text-black hover:bg-[#b8982a]/90 cursor-pointer"
                    }`}
            >
                {loading ? "Menyimpan..." : "Simpan"}
            </button>
        </div>
    );
}
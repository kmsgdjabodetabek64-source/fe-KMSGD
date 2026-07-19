interface KegiatanImageFieldProps {
    preview: string | null;
    file: File | null;
    onChange: (file: File) => void;
    onRemove: () => void;
}

export default function KegiatanImageField({ preview, file, onChange, onRemove }: KegiatanImageFieldProps) {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        onChange(f);
    };

    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Gambar</label>
            <div
                className="border border-dashed border-neutral-700 bg-neutral-900 p-6 text-center cursor-pointer relative hover:border-yellow-700 transition-colors"
                onClick={() => document.getElementById("imageInput")?.click()}
            >
                {preview ? (
                    <img src={preview} alt="preview" className="max-h-40 max-w-full object-cover mx-auto" />
                ) : (
                    <div className="text-neutral-600 text-sm">
                        <p className="mb-1">Klik untuk pilih gambar</p>
                    </div>
                )}
            </div>
            <input id="imageInput" type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            {file && (
                <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-xs text-neutral-600 truncate">{file.name}</p>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs text-red-400 hover:text-red-300 ml-2 shrink-0"
                    >
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
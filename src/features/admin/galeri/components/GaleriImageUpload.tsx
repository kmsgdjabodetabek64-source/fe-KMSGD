interface GaleriImageUploadProps {
    preview: string | null;
    required: boolean;
    onFileChange: (file: File) => void;
}

export default function GaleriImageUpload({ preview, required, onFileChange }: GaleriImageUploadProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        onFileChange(f);
    };

    return (
        <div>
            <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">
                Gambar {required && "*"}
            </label>
            <div
                className="border border-dashed border-neutral-700 bg-neutral-900 p-4 text-center cursor-pointer hover:border-[#b8982a] transition-colors"
                onClick={() => document.getElementById("galeriImageInput")?.click()}
            >
                {preview ? (
                    <img src={preview} alt="preview" className="max-h-32 max-w-full object-cover mx-auto" />
                ) : (
                    <p className="text-neutral-600 text-sm">Klik untuk pilih gambar</p>
                )}
            </div>
            <input
                id="galeriImageInput"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}
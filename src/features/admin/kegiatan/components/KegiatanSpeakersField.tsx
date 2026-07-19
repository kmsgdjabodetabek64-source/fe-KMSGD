interface KegiatanSpeakersFieldProps {
    speakers: string[];
    speakerInput: string;
    onInputChange: (value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export default function KegiatanSpeakersField({
    speakers,
    speakerInput,
    onInputChange,
    onAdd,
    onRemove,
}: KegiatanSpeakersFieldProps) {
    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Speakers</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={speakerInput}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onAdd();
                        }
                    }}
                    placeholder="Nama speaker"
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer"
                >
                    Tambah
                </button>
            </div>
            {speakers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {speakers.map((s, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 text-[#ffd700]">
                            {s}
                            <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-300 cursor-pointer">
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
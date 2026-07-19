interface GaleriJudulInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function GaleriJudulInput({ value, onChange }: GaleriJudulInputProps) {
    return (
        <div>
            <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">Judul</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Judul foto (opsional)"
                className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a] placeholder:text-neutral-600"
            />
        </div>
    );
}
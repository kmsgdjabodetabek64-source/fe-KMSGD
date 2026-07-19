import type { Kegiatan } from "../../kegiatan/kegiatanTypes";

interface GaleriKegiatanSelectProps {
    value: string;
    options: Kegiatan[];
    onChange: (value: string) => void;
}

export default function GaleriKegiatanSelect({ value, options, onChange }: GaleriKegiatanSelectProps) {
    return (
        <div>
            <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">
                Kegiatan <span className="text-neutral-600 normal-case font-normal">— opsional</span>
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a]"
            >
                <option value="">— Tidak terkait kegiatan —</option>
                {options.map((k) => (
                    <option key={k.id} value={k.id}>{k.title}</option>
                ))}
            </select>
        </div>
    );
}
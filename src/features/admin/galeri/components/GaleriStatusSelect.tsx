interface GaleriStatusSelectProps {
    isPublished: boolean;
    onChange: (isPublished: boolean) => void;
}

export default function GaleriStatusSelect({ isPublished, onChange }: GaleriStatusSelectProps) {
    return (
        <div>
            <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">Status</label>
            <select
                value={isPublished ? "true" : "false"}
                onChange={(e) => onChange(e.target.value === "true")}
                className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a]"
            >
                <option value="true">Publik</option>
                <option value="false">Draft</option>
            </select>
        </div>
    );
}
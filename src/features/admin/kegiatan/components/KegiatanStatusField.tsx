interface KegiatanStatusFieldProps {
    isPublished: boolean;
    onChange: (isPublished: boolean) => void;
}

export default function KegiatanStatusField({ isPublished, onChange }: KegiatanStatusFieldProps) {
    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Status</label>
            <select
                value={isPublished ? "true" : "false"}
                onChange={(e) => onChange(e.target.value === "true")}
                className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
            >
                <option value="true">Publik</option>
                <option value="false">Draft</option>
            </select>
        </div>
    );
}
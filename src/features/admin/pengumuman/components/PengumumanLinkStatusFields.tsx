interface PengumumanLinkStatusFieldsProps {
    linkPendaftaran: string;
    isPublished: boolean;
    onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusChange: (isPublished: boolean) => void;
}

export default function PengumumanLinkStatusFields({
    linkPendaftaran,
    isPublished,
    onLinkChange,
    onStatusChange,
}: PengumumanLinkStatusFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                    Link Pendaftaran <span className="normal-case text-neutral-600">(Opsional)</span>
                </label>
                <input
                    type="url"
                    name="linkPendaftaran"
                    value={linkPendaftaran}
                    onChange={onLinkChange}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Status</label>
                <select
                    value={isPublished ? "true" : "false"}
                    onChange={(e) => onStatusChange(e.target.value === "true")}
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                >
                    <option value="true">Publik</option>
                    <option value="false">Draft</option>
                </select>
            </div>
        </div>
    );
}
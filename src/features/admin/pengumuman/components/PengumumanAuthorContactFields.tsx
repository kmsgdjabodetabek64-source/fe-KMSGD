interface PengumumanAuthorContactFieldsProps {
    author: string;
    contactPerson: string;
    onAuthorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onContactPersonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PengumumanAuthorContactFields({
    author,
    contactPerson,
    onAuthorChange,
    onContactPersonChange,
}: PengumumanAuthorContactFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Author *</label>
                <input
                    type="text"
                    name="author"
                    value={author}
                    onChange={onAuthorChange}
                    placeholder="Nama penulis / divisi"
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Contact Person</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="contactPerson"
                    value={contactPerson}
                    onChange={onContactPersonChange}
                    placeholder="081234567890"
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
        </div>
    );
}
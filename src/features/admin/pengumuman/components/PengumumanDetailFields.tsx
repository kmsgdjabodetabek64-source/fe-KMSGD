interface PengumumanDetailFieldsProps {
    title: string;
    desc: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function PengumumanDetailFields({ title, desc, onChange }: PengumumanDetailFieldsProps) {
    return (
        <>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Judul *</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Judul pengumuman"
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>

            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Deskripsi *</label>
                <textarea
                    name="desc"
                    value={desc}
                    onChange={onChange}
                    placeholder="Deskripsi pengumuman..."
                    required
                    rows={4}
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700 resize-y"
                />
            </div>
        </>
    );
}
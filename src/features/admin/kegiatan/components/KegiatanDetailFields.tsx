interface KegiatanDetailFieldsProps {
    title: string;
    desc: string;
    location: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function KegiatanDetailFields({ title, desc, location, onChange }: KegiatanDetailFieldsProps) {
    return (
        <>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Judul *</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Judul kegiatan"
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
                    placeholder="Deskripsi kegiatan..."
                    required
                    rows={4}
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700 resize-y"
                />
            </div>

            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Lokasi *</label>
                <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={onChange}
                    placeholder="Nama tempat / alamat"
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
        </>
    );
}